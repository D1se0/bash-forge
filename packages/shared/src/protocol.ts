/**
 * Protocolo del WebSocket Bash Forge.
 * Un único canal por conexión de navegador; N terminales (PTY) por conexión.
 * Todos los mensajes son JSON: la primera propiedad `type` discrimina el payload.
 */
export type WsDirection = "client" | "server";

/** ---------- cliente → servidor ---------- */

export interface ClientInputMsg {
  type: "input";
  /** Identificador de terminal destino dentro de la conexión. */
  termId: string;
  /** Bytes crudos de teclado leídos por xterm.js (texto UTF-8). */
  data: string;
}

export interface ClientResizeMsg {
  type: "resize";
  termId: string;
  cols: number;
  rows: number;
}

export interface ClientPingMsg {
  type: "ping";
  /** Instante (performance.now) del cliente para calcular el RTT al recibir `pong`. */
  t: number;
}

/** El cliente pide una PTY nueva (pestaña). */
export interface ClientTermNewMsg {
  type: "term:new";
}

export interface ClientTermCloseMsg {
  type: "term:close";
  termId: string;
}

/** Foco en una pestaña existente; se usa para rutas de restauración. */
export interface ClientTermActivateMsg {
  type: "term:activate";
  termId: string;
}

/**
 * Reanudar una reunión previa tras recargar la página:
 * con el `sessionToken` se re-adjuntan home + PTYs vivas del mismo par (forgeId).
 */
export interface ClientSessionAttachMsg {
  type: "session:attach";
  sessionToken: string;
}

/** Reset del home del alumno: borra y vuelve a la plantilla inicial. */
export interface ClientSessionResetMsg {
  type: "session:reset";
}

export interface ClientCheckMsg {
  type: "exercise:check";
  lessonId: string;
}

/** El cliente prepara el entorno del ejercicio (corre setup.sh en el home). */
export interface ClientSetupMsg {
  type: "exercise:setup";
  lessonId: string;
}

export interface ServerSetupResultMsg {
  type: "exercise:setup:result";
  lessonId: string;
  ok: boolean;
  stderr?: string;
}

export interface ClientProgressSaveMsg {
  type: "progress:save";
  snapshot: string; // ProgressSnapshot serializado (JSON)
}

export interface ClientProgressLoadMsg {
  type: "progress:load";
}

/** Descargar el home del alumno (tar.gz por base64 dentro del WS). */
export interface ClientSnapshotReqMsg {
  type: "snapshot:request";
}

export type ClientMessage =
  | ClientInputMsg
  | ClientResizeMsg
  | ClientPingMsg
  | ClientTermNewMsg
  | ClientTermCloseMsg
  | ClientTermActivateMsg
  | ClientSessionAttachMsg
  | ClientSessionResetMsg
  | ClientCheckMsg
  | ClientSetupMsg
  | ClientProgressSaveMsg
  | ClientProgressLoadMsg
  | ClientSnapshotReqMsg;

/** ---------- servidor → cliente ---------- */

export interface ServerOutputMsg {
  type: "output";
  termId: string;
  data: string;
}

export interface ServerPongMsg {
  type: "pong";
  t: number;
  rttMs: number;
}

/** Metadatos de la sesión al conectar o re-adjuntar. */
export interface ServerSessionMsg {
  type: "session";
  homeId: string; // forge_123
  user: string; // forge_123
  sessionToken: string;
  terms: string[]; // termIds activos
  motd: string;
  /** Restricciones vigentes: tiempo máximo de sesión en s. */
  maxSessionSeconds: number;
}

export interface CheckDetail {
  id: string;
  name: string;
  pass: boolean;
  expected: string;
  got: string;
  hint?: string;
}

export interface ServerCheckResultMsg {
  type: "exercise:result";
  lessonId: string;
  pass: boolean;
  checks: CheckDetail[];
  tookMs: number;
}

export interface ServerErrorMsg {
  type: "error";
  code:
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
  message: string;
}

export interface ServerTermExitMsg {
  type: "term:exit";
  termId: string;
  exitCode: number;
}

/** Respuesta a progress:load (el cliente guarda en localStorage y en el volumen). */
export interface ServerProgressMsg {
  type: "progress:load";
  snapshot: string;
}

export interface ServerSnapshotMsg {
  type: "snapshot:data";
  name: string;
  /** tar.gz del home, base64. */
  data: string;
}

export type ServerMessage =
  | ServerOutputMsg
  | ServerPongMsg
  | ServerSessionMsg
  | ServerCheckResultMsg
  | ServerSetupResultMsg
  | ServerProgressMsg
  | ServerErrorMsg
  | ServerTermExitMsg
  | ServerSnapshotMsg;

/** Typeguards usados por ambos lados (tests incluidos). */
export function isClientMessage(value: unknown): value is ClientMessage {
  if (typeof value !== "object" || value === null) return false;
  const rec = value as Record<string, unknown>;
  if (typeof rec.type !== "string") return false;
  switch (rec.type) {
    case "input":
    case "resize":
    case "term:close":
      return typeof rec.termId === "string";
    case "term:activate":
      return typeof rec.termId === "string";
    case "ping": {
      return typeof rec.t === "number";
    }
    case "term:new":
    case "session:attach":
    case "session:reset":
    case "progress:load":
    case "snapshot:request":
      return true;
    case "exercise:check":
    case "exercise:setup":
      return typeof rec.lessonId === "string" && (rec.lessonId as string).length <= 128;
    case "progress:save":
      return typeof rec.snapshot === "string" && rec.snapshot.length <= 200_000;
    default:
      return false;
  }
}

/** Typeguard del lado servidor: sesión válida al menos con tokens y lista de PTYs. */
export function isServerMessage(value: unknown): value is ServerMessage {
  if (typeof value !== "object" || value === null) return false;
  const rec = value as Record<string, unknown>;
  if (typeof rec.type !== "string") return false;
  switch (rec.type) {
    case "session":
      return (
        typeof rec.homeId === "string" &&
        typeof rec.user === "string" &&
        typeof rec.sessionToken === "string" &&
        typeof rec.motd === "string" &&
        typeof rec.maxSessionSeconds === "number" &&
        Array.isArray(rec.terms)
      );
    case "output":
    case "term:exit":
      return typeof rec.termId === "string" && (rec.type === "term:exit" ? typeof rec.exitCode === "number" : typeof rec.data === "string");
    case "pong":
      return typeof rec.t === "number" && typeof rec.rttMs === "number";
    case "exercise:result":
      return typeof rec.lessonId === "string" && typeof rec.pass === "boolean" && Array.isArray(rec.checks);
    case "exercise:setup:result":
      return typeof rec.lessonId === "string" && typeof rec.ok === "boolean";
    case "progress:load":
      return typeof rec.snapshot === "string";
    case "snapshot:data":
      return typeof rec.name === "string" && typeof rec.data === "string";
    case "error":
      return typeof rec.code === "string" && typeof rec.message === "string";
    default:
      return false;
  }
}

/** Límite de tamaño de un mensaje WS por defecto (1 MiB, salida de paste de ficheros). */
export const WS_MAX_MESSAGE_BYTES = 1_048_576;

/** Límites operativos por conexión (el sandbox-server los aplica). */
export const CONNECTION_LIMITS = {
  maxTermsPerConnection: 6,
  maxSessions: 50,
  /** Mensajes por segundo por conexión. */
  maxMessageRate: 120,
  /** Segundos de inactividad antes de cerrar la conexión WS. */
  idleTimeoutSeconds: 300,
  activityHeartbeatSeconds: 10,
} as const;
