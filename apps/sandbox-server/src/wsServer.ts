import crypto from "node:crypto";
import WebSocket, { type WebSocketServer } from "ws";
import type {
  ServerMessage,
  ServerSessionMsg,
} from "@bashforge/shared";
import { isClientMessage, CONNECTION_LIMITS } from "@bashforge/shared";
import type { EnvConfig } from "./env";
import type { UserPool, PoolSession } from "./pool";
import type { LessonStore } from "./lessons";
import type { LessonChecker } from "./checker";
import type { PtyManager } from "./ptyManager";
import type { ProgressStore } from "./progress";
import { homeSnapshot } from "./snapshot";

const MOTD =
  "Forge iniciada. Escribe 'ls' para tus ficheros o 'lessons' para las lecciones disponibles.";

export interface WsServerDeps {
  env: EnvConfig;
  pool: UserPool;
  store: LessonStore;
  checker: LessonChecker;
  pty: PtyManager;
  progress: ProgressStore;
  log: (level: "info" | "warn" | "error", msg: string) => void;
}

/** El WSServer real — instanciate con `new WebSocket.Server` en index.ts. */
export class ForgeWsConnection {
  readonly id: string;
  private session: PoolSession | null = null;
  private termIds: Map<string, true> = new Map(); // termId → true
  private activeTerms: Set<string> = new Set();
  private rateWindowStart: number = Date.now();
  private rateCount = 0;
  private closed = false;
  private readonly deps: WsServerDeps;

  constructor(
    private readonly ws: WebSocket,
    deps: WsServerDeps,
  ) {
    this.id = crypto.randomBytes(6).toString("hex");
    this.deps = deps;
  }

  send(msg: ServerMessage): void {
    if (this.closed || this.ws.readyState !== WebSocket.OPEN) return;
    try {
      this.ws.send(JSON.stringify(msg));
    } catch {
      /* conexión en cierre */
    }
  }

  error(code: ServerErrorMsgCode, message: string): void {
    this.send({ type: "error", code, message });
  }

  /** Procesa un mensaje de texto recibido. */
  handle(msgText: string): void {
    if (this.closed) return;
    if (!this.checkRate()) {
      this.error("too_many_sessions", "Demasiadas conexiones/abuso… redúcelo, por favor.");
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(msgText);
    } catch {
      this.error("bad_message", "No es JSON válido.");
      return;
    }
    if (!isClientMessage(parsed)) {
      this.error("bad_message", "Mensaje no reconocido o fuera de los límites.");
      return;
    }
    switch (parsed.type) {
      case "ping": {
        this.send({ type: "pong", t: parsed.t, rttMs: Date.now() - parsed.t });
        return;
      }
      case "input": {
        const t = this.deps.pty.get(parsed.termId);
        if (!t || t.user !== this.session?.user) {
          this.error("unknown_term", `Terminal ${parsed.termId} no existe o no es tuya.`);
          return;
        }
        // límite de tamaño por tecla (pegado masivo silenciado a 256 KiB)
        if (parsed.data.length > 256 * 1024) {
          this.error("bad_message", "Input demasiado grande.");
          return;
        }
        t.proc.write(parsed.data);
        return;
      }
      case "resize": {
        const t = this.deps.pty.get(parsed.termId);
        if (!t || t.user !== this.session?.user) return;
        t.cols = Math.min(Math.max(parsed.cols, 2), 500);
        t.rows = Math.min(Math.max(parsed.rows, 2), 300);
        t.proc.resize(t.cols, t.rows);
        return;
      }
      case "term:new": {
        this.newTerm();
        return;
      }
      case "term:close": {
        const t = this.deps.pty.get(parsed.termId);
        if (!t || t.user !== this.session?.user) return;
        this.deps.pty.close(parsed.termId);
        this.activeTerms.delete(parsed.termId);
        this.send({ type: "term:exit", termId: parsed.termId, exitCode: 0 });
        return;
      }
      case "term:activate": {
        // en una reconexión restauramos el backBuffer para el foco de xterm
        void parsed.termId; // el cliente ya guarda pero grabó el foco propio
        return;
      }
      case "session:attach": {
        this.attach(parsed.sessionToken);
        return;
      }
      case "session:reset": {
        if (!this.session) return;
        this.deps.pty.closeUser(this.session.user);
        this.deps.pool.setupHome(this.session.user, true);
        const fresh = this.deps.pool.attach(this.session.sessionToken, this.session.forgeId);
        this.session = fresh;
        if (fresh) this.sendSession(fresh);
        return;
      }
      case "exercise:setup": {
        const lesson = this.deps.store.get(parsed.lessonId);
        if (!lesson) {
          this.error("lesson_not_found", `La lección ${parsed.lessonId} no existe.`);
          return;
        }
        if (!this.session) return;
        const out = this.deps.checker.runSetup(lesson, this.session.user);
        this.send({
          type: "exercise:setup:result",
          lessonId: lesson.id,
          ok: out.passed,
          stderr: out.stderr || undefined,
        });
        return;
      }
      case "exercise:check": {
        const lesson = this.deps.store.get(parsed.lessonId);
        if (!lesson) {
          this.error("lesson_not_found", `La lección ${parsed.lessonId} no existe.`);
          return;
        }
        if (!this.session) return;
        const result = this.deps.checker.runCheck(lesson, this.session.user);
        this.send({
          type: "exercise:result",
          lessonId: lesson.id,
          pass: result.pass,
          checks: result.checks,
          tookMs: result.tookMs,
        });
        return;
      }
      case "progress:save": {
        if (!this.session) return;
        const ok = this.deps.progress.save(this.session.forgeId, parsed.snapshot);
        if (!ok) this.error("bad_message", "Progreso no válido; reverificado y no guardado.");
        return;
      }
      case "progress:load": {
        if (!this.session) return;
        const snapshot = this.deps.progress.load(this.session.forgeId);
        if (snapshot) this.send({ type: "progress:load", snapshot });
        return;
      }
      case "snapshot:request": {
        if (!this.session) return;
        const snap = homeSnapshot(this.session.user);
        if (snap) this.send({ type: "snapshot:data", name: snap.name, data: snap.base64 });
        else this.error("internal", "No se pudo empaquetar tu home.");
        return;
      }
      default: {
        this.error("bad_message", "Tipo de mensaje no soportado.");
      }
    }
  }

  private checkRate(): boolean {
    const now = Date.now();
    if (now - this.rateWindowStart > 1000) {
      this.rateWindowStart = now;
      this.rateCount = 0;
    }
    this.rateCount++;
    return this.rateCount <= this.deps.env.maxMessageRate;
  }

  /** Crea una PTY nueva para el usuario de la sesión. */
  newTerm(): void {
    if (!this.session) return;
    if (this.activeTerms.size >= this.deps.env.maxTermsPerConnection) {
      this.error("too_many_terms", `Máximo ${this.deps.env.maxTermsPerConnection} pestañas.`);
      return;
    }
    const termId = crypto.randomBytes(8).toString("hex");
    const t = this.deps.pty.spawn(termId, {
      user: this.session.user,
      cols: 80,
      rows: 24,
    });
    this.activeTerms.add(termId);
    this.termIds.set(termId, true);
    // anuncia la lista de pestañas (con la nueva) para que el cliente la monte
    if (this.session) this.sendSession(this.session);
    t.proc.onData((chunk: string) => {
      if (!this.closed) this.send({ type: "output", termId, data: chunk });
    });
    t.proc.onExit((code: number) => {
      this.activeTerms.delete(termId);
      this.termIds.delete(termId);
      this.send({ type: "term:exit", termId, exitCode: code });
    });
    this.send({ type: "session", ...this.sessionPayload(this.session), terms: [...this.activeTerms] });
  }

  /** Re-adjunta un token previo (recarga de página). */
  private attach(token: string): void {
    const s = this.deps.pool.attach(token, token);
    if (!s) {
      this.error("session_expired", "Tu sesión anterior expiró: comienza una nueva.");
      return;
    }
    this.session = s;
    this.sendSession(s);
  }

  private sendSession(s: PoolSession): void {
    this.send({ type: "session", ...this.sessionPayload(s), terms: [...this.activeTerms] });
  }

  private sessionPayload(s: PoolSession): Omit<ServerSessionMsg, "type" | "terms"> {
    return {
      homeId: s.user,
      user: s.user,
      sessionToken: s.sessionToken,
      motd: MOTD,
      maxSessionSeconds: this.deps.env.maxSessionMinutes * 60,
    };
  }

  /** Conexión nueva (sin token): crea sesión. Se llama al `open` del ws. */
  start(): void {
    const s = this.deps.pool.attach(undefined, `anon-${this.id}`);
    if (!s) {
      this.error("too_many_sessions", "Servidor ocupado: se alcanzó el límite de sesiones.");
      return;
    }
    this.session = s;
    this.sendSession(s);
    this.newTerm();
  }

  close(): void {
    this.closed = true;
    // cierra las PTYs propias si ningún otro cliente las comparte (una conexión por sesión)
    if (this.session) {
      this.deps.pty.closeUser(this.session.user);
      this.session.lastSeenAt = Date.now();
    }
  }
}

export type ServerErrorMsgCode =
  | "bad_message"
  | "too_many_sessions"
  | "too_many_terms"
  | "unknown_term"
  | "lesson_not_found"
  | "check_timeout"
  | "check_failed"
  | "session_expired"
  | "proxy_error"
  | "internal";

export function createForgeWsServer(
  wss: WebSocketServer,
  deps: WsServerDeps,
): void {
  wss.on("connection", (ws: WebSocket) => {
    const conn = new ForgeWsConnection(ws, deps);
    conn.start();
    ws.on("message", (raw: unknown) => {
      if (typeof raw !== "string" && !Buffer.isBuffer(raw)) return;
      const text = String(raw);
      if (text.length > 1_048_576) {
        conn.error("bad_message", "Mensaje demasiado grande (límite 1 MiB).");
        return;
      }
      conn.handle(text);
    });
    ws.on("pong", () => {
      // el idle-timeout conexiones usa_WS ping/pong de librería
      ws.ping();
    });
    ws.on("error", () => {
      /* el cliente ya cerró */
    });
    ws.on("close", () => conn.close());
  });
}

export function connectionHeartbeat(wss: WebSocketServer, log: WsServerDeps["log"]): void {
  setInterval(() => {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) client.ping();
    }
  }, CONNECTION_LIMITS.activityHeartbeatSeconds * 1000);
  void log;
}
