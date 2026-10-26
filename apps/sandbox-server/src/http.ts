import express from "express";
import type { LessonStore } from "./lessons";

export interface HttpApi {
  app: express.Express;
}

export function createHttpServer(store: LessonStore): HttpApi {
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

  return { app };
}
