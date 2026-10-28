import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "node:http";
import { loadEnv } from "./env";
import { UserPool } from "./pool";
import { LessonStore } from "./lessons";
import { LessonChecker } from "./checker";
import { PtyManager } from "./ptyManager";
import { ProgressStore } from "./progress";
import { createHttpServer } from "./http";
import { createForgeWsServer, connectionHeartbeat, type WsServerDeps } from "./wsServer";

function log(level: "info" | "warn" | "error", msg: string): void {
  const line = `[${new Date().toISOString()}] [${level}] ${msg}`;
  if (level === "error") console.error(line);
  else console.log(line);
}

function main(): void {
  const env = loadEnv();
  log("info", `sandbox-server → puerto ${env.httpPort}, lessons=${env.lessonsDir}`);

  const pool = new UserPool({ env, log });
  const store = new LessonStore(env.lessonsDir);
  const checker = new LessonChecker(store, env.checkTimeoutSeconds);
  const progress = new ProgressStore(env.progressDir);
  const pty = new PtyManager(null); // fábrica real con node-pty

  const { app } = createHttpServer(store, progress);
  const server: Server = app.listen(env.httpPort, () => {
    log("info", `HTTP listo en :${env.httpPort} (health=/api/health, lessons=/api/lessons)`);
  });

  const wss = new WebSocketServer({ server, path: "/ws", maxPayload: 1_048_576 });
  const deps: WsServerDeps = { env, pool, store, checker, pty, progress, log };
  createForgeWsServer(wss, deps);
  log("info", `WebSocket listo en ws://:${env.httpPort}/ws`);

  // Limpieza de sesiones expiradas cada minuto.
  const sweep = setInterval(() => {
    const freed = pool.sweep(Date.now());
    if (freed > 0) log("info", `sweep: ${freed} sesiones liberadas por TTL`);
  }, 60_000);
  sweep.unref?.();
  connectionHeartbeat(wss, log);

  const shutdown = (signal: string) => {
    log("info", `apagando por ${signal}…`);
    for (const client of wss.clients) client.close();
    wss.close();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 2000).unref?.();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("uncaughtException", (err) => {
    log("error", `uncaughtException: ${err.stack ?? String(err)}`);
  });
}

main();

export { WebSocket };
