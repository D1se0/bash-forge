import express from "express";
import type { LessonStore } from "./lessons";
import type { ProgressStore } from "./progress";

export interface HttpApi {
  app: express.Express;
}

export function createHttpServer(store: LessonStore, progress?: ProgressStore): HttpApi {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "64kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, uptime: process.uptime(), name: "bashforge-sandbox" });
  });

  app.get("/api/lessons", (_req, res) => {
    res.json(store.list());
  });

  app.get("/api/lessons/:id", (req, res) => {
    const lesson = store.get(req.params.id);
    if (!lesson) {
      res.status(404).json({ error: "lesson_not_found" });
      return;
    }
    res.json(lesson);
  });

  // ---- progreso persistido (backups + inspección desde el CLI) ----------

  /** Lista los ids de forja con progreso guardado en el volumen. */
  app.get("/api/progress", (_req, res) => {
    if (!progress) {
      res.status(501).json({ error: "progress_unavailable" });
      return;
    }
    res.json({ students: progress.listAll().filter((s) => s !== "sessions") });
  });

  /** Devuelve el snapshot de un forgeId: el CLI lo respalda antes de purgar. */
  app.get("/api/progress/:forgeId", (req, res) => {
    if (!progress) {
      res.status(501).json({ error: "progress_unavailable" });
      return;
    }
    const snapshot = progress.load(req.params.forgeId);
    if (snapshot === null) {
      res.status(404).json({ error: "progress_not_found" });
      return;
    }
    res.type("application/json").send(snapshot);
  });

  return { app };
}
