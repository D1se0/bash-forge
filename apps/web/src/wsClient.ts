import type {
  ClientMessage,
  ServerMessage,
  ServerSessionMsg,
  CheckDetail,
  LessonMeta,
} from "@bashforge/shared";

/** URL del WS: misma origin que la página (nginx proxifies /ws). */
export function wsUrl(): string {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${location.host}/ws`;
}

export interface TerminalState {
  id: string;
  title: string;
  exited: boolean;
}

export type WsEvents = {
  onSession: (s: ServerSessionMsg) => void;
  onOutput: (termId: string, data: string) => void;
  onTermExit: (termId: string, code: number) => void;
  onCheckResult: (lessonId: string, pass: boolean, checks: CheckDetail[], tookMs: number) => void;
  onSetupResult: (lessonId: string, ok: boolean, stderr?: string) => void;
  onProgress: (snapshotJson: string) => void;
  onSnapshot: (name: string, base64: string) => void;
  onError: (code: string, message: string) => void;
  onRtt: (ms: number) => void;
  onOpen: () => void;
  onClose: () => void;
};

export class ForgeWs {
  private ws!: WebSocket;
  private events: Partial<WsEvents> = {};
  private sendQueue: ClientMessage[] = [];
  private attachToken: string | null = null;
  pingTimer: ReturnType<typeof setInterval> | null = null;

  connect(events: Partial<WsEvents>): void {
    this.events = events;
    this.ws = new WebSocket(wsUrl());
    this.ws.addEventListener("open", () => {
      for (const m of this.sendQueue) this.send(m);
      this.sendQueue = [];
      if (this.attachToken) {
        this.send({ type: "session:attach", sessionToken: this.attachToken });
      }
      this.pingTimer = setInterval(() => {
        const t = performance.now();
        this.send({ type: "ping", t });
      }, 5000);
      this.events.onOpen?.();
    });
    this.ws.addEventListener("message", (ev) => {
      let msg: ServerMessage;
      try {
        msg = JSON.parse(String(ev.data)) as ServerMessage;
      } catch {
        return;
      }
      switch (msg.type) {
        case "session":
          this.attachToken = msg.sessionToken;
          saveToken(msg.sessionToken);
          this.events.onSession?.(msg);
          break;
        case "output":
          this.events.onOutput?.(msg.termId, msg.data);
          break;
        case "term:exit":
          this.events.onTermExit?.(msg.termId, msg.exitCode);
          break;
        case "exercise:result":
          this.events.onCheckResult?.(msg.lessonId, msg.pass, msg.checks, msg.tookMs);
          break;
        case "exercise:setup:result":
          this.events.onSetupResult?.(msg.lessonId, msg.ok, msg.stderr);
          break;
        case "progress:load":
          this.events.onProgress?.(msg.snapshot);
          break;
        case "snapshot:data":
          this.events.onSnapshot?.(msg.name, msg.data);
          break;
        case "error":
          if (msg.code !== "unknown_term") this.events.onError?.(msg.code, msg.message);
          break;
        case "pong":
          this.events.onRtt?.(msg.rttMs);
          break;
      }
    });
    this.ws.addEventListener("close", () => {
      if (this.pingTimer) clearInterval(this.pingTimer);
      this.events.onClose?.();
      // Reconección con espalda (backoff simple)
      setTimeout(() => this.connect(events), 1500);
    });
  }

  send(msg: ClientMessage): void {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      this.sendQueue.push(msg);
    }
  }

  restoreToken(): string | null {
    if (this.attachToken) return this.attachToken;
    this.attachToken = localStorage.getItem("bf.sessionToken");
    return this.attachToken;
  }

  forgetToken(): void {
    this.attachToken = null;
    localStorage.removeItem("bf.sessionToken");
  }
}

function saveToken(t: string): void {
  localStorage.setItem("bf.sessionToken", t);
}

/** API HTTP de lecciones (nginx → sandbox-server). Flask devuelve LessonMeta[] completos. */
export async function fetchLessonList(): Promise<LessonMeta[]> {
  const r = await fetch("/api/lessons");
  if (!r.ok) throw new Error("no lessons");
  const j = (await r.json()) as LessonMeta[];
  return j;
}

export async function fetchLesson<T>(id: string): Promise<T> {
  const r = await fetch(`/api/lessons/${encodeURIComponent(id)}`);
  if (!r.ok) throw new Error(`lesson ${id} no encontrada`);
  return (await r.json()) as T;
}
