import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { EnvConfig } from "./env";

/**
 * Pool de usuarios de sesión pre-creados (forge_000 … forge_499) + registro
 * de sesiones activas persistido en disco para sobrevivir a reinicios.
 * Un "session user" no tiene privilegios y su home vive en el volumen /home.
 */

export interface PoolSession {
  /** Clave de sesión entregada al cliente. */
  sessionToken: string;
  /** ID de navegador (viene del cliente, persistido en localStorage). */
  forgeId: string;
  /** Usuario Linux asignado, p. ej. `forge_042`. */
  user: string;
  createdAt: number;
  lastSeenAt: number;
}

export interface SessionStoreFile {
  version: 1;
  sessions: Record<string, PoolSession>; // sessionToken → session
}

export interface UserPoolDeps {
  env: EnvConfig;
  /** Logger de eventos de pool. */
  log: (level: "info" | "warn" | "error", msg: string) => void;
}

export class UserPool {
  private readonly env: EnvConfig;
  private readonly log: UserPoolDeps["log"];
  private sessions: Map<string, PoolSession> = new Map();
  private storePath: string;
  /** Usuarios libres, pila LIFO para reutilizar los recientes (mejor caché del disco). */
  private freeUsers: string[] = [];

  constructor(deps: UserPoolDeps) {
    this.env = deps.env;
    this.log = deps.log;
    this.storePath = path.join(this.env.progressDir, "sessions.json");
    this.bootstrap();
  }

  /** Al arrancar: carga sesiones persistidas y libera los usuarios huérfanos. */
  bootstrap(): void {
    const users = new Set<string>();
    for (let i = 0; i < this.env.poolSize; i++) {
      const name = `forge_${String(i).padStart(3, "0")}`;
      if (fs.existsSync(path.join(this.env.homeRoot, name))) users.add(name);
      else users.add(name); // igualmente reservable: useradd ocurre en build
      (void name);
    }
    this.freeUsers = [...users];

    try {
      if (fs.existsSync(this.storePath)) {
        const raw = fs.readFileSync(this.storePath, "utf8");
        const parsed = JSON.parse(raw) as SessionStoreFile;
        if (parsed && parsed.version === 1) {
          for (const s of Object.values(parsed.sessions)) {
            if (!users.has(s.user)) continue; // usuario borrado
            this.sessions.set(s.sessionToken, s);
            this.freeUsers = this.freeUsers.filter((u) => u !== s.user);
          }
        }
      }
    } catch (err) {
      this.log("warn", `no se pudo cargar sessions.json: ${String(err)}`);
    }

    // Huérfanos: homes de usuarios sin sesión activa → vaciados (a la plantilla).
    for (const user of users) {
      if (this.isAssigned(user)) continue;
      this.resetHome(user);
    }
    this.persist();
    this.log(
      "info",
      `pool listo: ${this.freeUsers.length}/${this.env.poolSize} usuarios libres, ` +
        `${this.sessions.size} sesiones activas`,
    );
  }

  isAssigned(user: string): boolean {
    for (const s of this.sessions.values()) if (s.user === user) return true;
    return false;
  }

  /** Asigna (o re-adjunta) una sesión. forgeId agrupa sesiones del mismo navegador. */
  /**
   * Asigna (o re-adjunta) una sesión. El forgeId agrupa sesiones del mismo
   * cliente: en la práctica es el sessionToken persistido en localStorage,
   * así que tras un reinicio el cliente recupera SU usuario y su home.
   */
  attach(sessionToken: string | undefined, forgeId: string): PoolSession | null {
    if (sessionToken) {
      const existing = this.sessions.get(sessionToken);
      if (existing) {
        existing.lastSeenAt = Date.now();
        this.persist();
        return existing;
      }
    }
    const user = this.freeUsers.pop();
    if (!user) return null;
    const token = sessionToken ?? crypto.randomBytes(24).toString("hex");
    const session: PoolSession = {
      sessionToken: token,
      forgeId,
      user,
      createdAt: Date.now(),
      lastSeenAt: Date.now(),
    };
    this.sessions.set(token, session);
    this.setupHome(user);
    this.persist();
    return session;
  }

  /** Libre expirado: quita la sesión y libera el usuario para el pool. */
  release(sessionToken: string): void {
    const s = this.sessions.get(sessionToken);
    if (!s) return;
    this.sessions.delete(sessionToken);
    this.freeUsers.push(s.user);
    this.persist();
  }

  /** Cierra sesiones inactivas en caliente y a la expiración de su vida útil. */
  sweep(now: number): number {
    let freed = 0;
    for (const [token, s] of [...this.sessions]) {
      const ttlMs = this.env.sessionTtlMinutes * 60_000;
      const maxMs = this.env.maxSessionMinutes * 60_000;
      if (now - s.lastSeenAt > ttlMs || now - s.createdAt > maxMs) {
        this.release(token);
        freed++;
      }
    }
    return freed;
  }

  get active(): number {
    return this.sessions.size;
  }

  listSessions(): PoolSession[] {
    return [...this.sessions.values()];
  }

  private persist(): void {
    try {
      fs.mkdirSync(this.env.progressDir, { recursive: true });
      const data: SessionStoreFile = { version: 1, sessions: {} };
      for (const [k, v] of this.sessions) data.sessions[k] = v;
      fs.writeFileSync(this.storePath, JSON.stringify(data, null, 2));
    } catch {
      /* persistencia best-effort */
    }
  }

  /** Reset home al esqueleto. Sin `rm -rf` en caliente del home completo para no
   * correr riesgos; peremos ficheros de trabajo del alumno salvo reset explícito. */
  private resetHome(user: string): void {
    this.setupHome(user, true);
  }

  /** Asegura el home del usuario, limpiándolo si `wipe` (aislamiento: un nuevo
   * inquilino nunca ve ficheros del anterior). */
  setupHome(user: string, wipe = false, skelFiles: Record<string, string> = {}): void {
    const homePath = path.join(this.env.homeRoot, user);
    fs.mkdirSync(homePath, { recursive: true, mode: 0o750 });
    if (wipe) {
      // borra TODO el contenido (el home es workspace efímero del usuario actual)
      for (const f of fs.readdirSync(homePath)) {
        fs.rmSync(path.join(homePath, f), { recursive: true, force: true });
      }
    }
    fs.mkdirSync(path.join(homePath, "workspace"), { recursive: true, mode: 0o750 });
    // ficheros de plantilla: .bashrc / .bash_profile del esqueleto de la imagen
    try {
      const skel = this.env.skelDir;
      if (fs.existsSync(skel)) {
        for (const f of fs.readdirSync(skel)) {
          const src = path.join(skel, f);
          const dst = path.join(homePath, f);
          if (f === ".bashrc" && fs.existsSync(dst) && !wipe) continue;
          fs.copyFileSync(src, dst);
        }
      }
    } catch {
      /* esqueleto opcional en dev local */
    }
    for (const [name, content] of Object.entries(skelFiles)) {
      fs.writeFileSync(path.join(homePath, name), content);
    }
  }
}
