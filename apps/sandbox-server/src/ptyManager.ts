/**
 * Gestor de PTYs: una pestaña de terminal = un proceso real.
 * Lanzamos `su -l forge_NNN` (bash login del usuario de sesión) bajo un wrapper
 * `/usr/local/bin/forge-spawn` que aplica ulimits ANTES de cambiar de usuario.
 * node-pty se carga en runtime (native); en unit tests el cliente inyecta otro spawn.
 */

export interface PtyProcess {
  pid: number;
  write: (data: string) => void;
  resize: (cols: number, rows: number) => void;
  kill: () => void;
  /** Registra suscriptores de datos; devuelve función unsubscribe. */
  onData: (cb: (data: string) => void) => () => void;
  onExit: (cb: (code: number) => void) => () => void;
}

export interface SpawnOptions {
  user: string;
  cols: number;
  rows: number;
}

export type PtyFactory = (opts: SpawnOptions) => PtyProcess;

/** Fábrica real con node-pty; requiere node-pty instalado (imagen sandbox). */
export function realPtyFactory(): PtyFactory {
  // import dinámico en runtime (módulo nativo); `any` al no haber tipos seguros
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let libPty: any;
  try {
    libPty = require("node-pty");
  } catch (err) {
    throw new Error(
      `node-pty no disponible (${String(err)}): ejecuta dentro del contenedor sandbox ` +
        `(docker compose up sandbox) o usa el mock en tests.`,
    );
  }
  if (!libPty) throw new Error("node-pty no disponible");
  return (opts: SpawnOptions): PtyProcess => {
    const term = libPty.spawn("/usr/local/bin/forge-spawn", [opts.user], {
      name: "xterm-256color",
      cols: opts.cols,
      rows: opts.rows,
      cwd: "/",
      env: {
        TERM: "xterm-256color",
        FORGE_USER: opts.user,
        HOME: `/home/${opts.user}`,
        USER: opts.user,
        PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games",
      } as Record<string, string>,
    });
    const dataSubs = new Set<(d: string) => void>();
    const exitSubs = new Set<(code: number) => void>();
    term.onData((d: string) => {
      for (const cb of dataSubs) cb(d);
    });
    term.onExit(({ exitCode }: { exitCode: number }) => {
      for (const cb of exitSubs) cb(exitCode);
    });
    return {
      pid: term.pid,
      write: (d: string) => term.write(d),
      resize: (c: number, r: number) => term.resize(c, r),
      kill: () => {
        try {
          term.kill();
        } catch {
          /* ya muerto */
        }
      },
      onData: (cb) => {
        dataSubs.add(cb);
        return () => dataSubs.delete(cb);
      },
      onExit: (cb) => {
        exitSubs.add(cb);
        return () => exitSubs.delete(cb);
      },
    };
  };
}

/** Pestaña de terminal activa dentro de una conexión. */
export interface ActiveTerm {
  termId: string;
  user: string;
  proc: PtyProcess;
  cols: number;
  rows: number;
  /** Cola de salida de respaldo mientras no hay cliente suscrito (recarga de página). */
  backBuffer: string[];
}

export class PtyManager {
  private terms: Map<string, ActiveTerm> = new Map();
  private factory: PtyFactory;

  constructor(factory: PtyFactory | null) {
    this.factory = factory ?? realPtyFactory();
  }

  spawn(termId: string, opts: SpawnOptions): ActiveTerm {
    const proc = this.factory(opts);
    const t: ActiveTerm = {
      termId,
      user: opts.user,
      proc,
      cols: opts.cols,
      rows: opts.rows,
      backBuffer: [],
    };
    const flush = (chunk: string) => {
      t.backBuffer.push(chunk);
      if (t.backBuffer.length > 40) t.backBuffer.splice(0, t.backBuffer.length - 40);
    };
    // el backBuffer se llena aunque nadie esté conectado (recuperación de scroll).
    proc.onData(flush);
    this.terms.set(termId, t);
    return t;
  }

  get(termId: string): ActiveTerm | undefined {
    return this.terms.get(termId);
  }

  list(user?: string): ActiveTerm[] {
    const all = [...this.terms.values()];
    if (!user) return all;
    return all.filter((t) => t.user === user);
  }

  close(termId: string): void {
    const t = this.terms.get(termId);
    if (!t) return;
    t.proc.kill();
    this.terms.delete(termId);
  }

  closeUser(user: string): number {
    let n = 0;
    for (const t of this.list(user)) {
      t.proc.kill();
      this.terms.delete(t.termId);
      n++;
    }
    return n;
  }

  get total(): number {
    return this.terms.size;
  }
}
