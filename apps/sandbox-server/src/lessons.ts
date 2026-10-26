import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import type { LessonContent, LessonMeta } from "@bashforge/shared";

/**
 * Cargador de currículum del disco (`LESSONS_DIR/<lesson-id>/{lesson.yaml,lesson.md,hints.md}`).
 * La solución (`solution.sh`) y el `check.sh` nunca salen por HTTP/WS.
 */
export class LessonStore {
  private readonly dir: string;
  private cache: Map<string, LessonContent> | null = null;
  private mtime: Map<string, number> = new Map();

  constructor(lessonsDir: string) {
    this.dir = lessonsDir;
  }

  private loadCache(): Map<string, LessonContent> {
    if (this.cache) return this.cache;
    const out = new Map<string, LessonContent>();
    if (!fs.existsSync(this.dir)) {
      this.cache = out;
      return out;
    }
    for (const entry of fs.readdirSync(this.dir)) {
      const full = path.join(this.dir, entry);
      if (!fs.statSync(full).isDirectory()) continue;
      const yamlPath = path.join(full, "lesson.yaml");
      if (!fs.existsSync(yamlPath)) continue;
      try {
        const metaRaw = parseYaml(fs.readFileSync(yamlPath, "utf8")) as Partial<LessonMeta>;
        if (!metaRaw.id || !metaRaw.validation) continue;
        const md = fs.existsSync(path.join(full, "lesson.md"))
          ? fs.readFileSync(path.join(full, "lesson.md"), "utf8")
          : "";
        const hints = fs.existsSync(path.join(full, "hints.md"))
          ? fs.readFileSync(path.join(full, "hints.md"), "utf8").split("\n---\n").filter((x) => x.trim())
          : metaRaw.validation.tasks.map((t) => t.message);
        const lesson: LessonContent = {
          id: metaRaw.id,
          title: metaRaw.title ?? entry,
          level: metaRaw.level ?? 0,
          kind: metaRaw.kind ?? "lesson",
          xp: metaRaw.xp ?? 10,
          estimatedMinutes: metaRaw.estimatedMinutes ?? 10,
          prerequisites: metaRaw.prerequisites ?? [], // se usa en cliente; aqui canonizamos
          tags: metaRaw.tags ?? [],
          objective: metaRaw.objective ?? "",
          files_to_create: metaRaw.files_to_create ?? [],
          validation: metaRaw.validation,
          md,
          hints,
        };
        out.set(metaRaw.id, lesson);
        this.mtime.set(metaRaw.id, fs.statSync(yamlPath).mtimeMs);
      } catch {
        // lección inválida se salta pero no rompe el arranque (el linter de lecciones la trae)
      }
    }
    this.cache = out;
    return out;
  }

  list(): LessonMeta[] {
    const all = [...this.loadCache().values()].map((l) => ({
      id: l.id,
      title: l.title,
      level: l.level,
      kind: l.kind,
      xp: l.xp,
      estimatedMinutes: l.estimatedMinutes,
      prerequisites: l.prerequisites,
      tags: l.tags,
      objective: l.objective,
      files_to_create: l.files_to_create,
      validation: l.validation,
    } as LessonMeta));
    return all.sort((a, b) => a.level - b.level || a.id.localeCompare(b.id));
  }

  get(id: string): LessonContent | null {
    return this.loadCache().get(id) ?? null;
  }

  /** Directorio de la lección (solo lado servidor, nunca vía HTTP). */
  dirOf(id: string): string | null {
    const found = fs.readdirSync(this.dir).find((e) => {
      const full = path.join(this.dir, e);
      if (!fs.statSync(full).isDirectory()) return false;
      const yaml = path.join(full, "lesson.yaml");
      if (!fs.existsSync(yaml)) return false;
      try {
        const parsed = parseYaml(fs.readFileSync(yaml, "utf8")) as { id?: string };
        return parsed.id === id;
      } catch {
        return false;
      }
    });
    return found ? path.join(this.dir, found) : null;
  }

  readRaw(id: string, file: string): string | null {
    const d = this.dirOf(id);
    if (!d) return null;
    const p = path.join(d, file);
    if (!fs.existsSync(p)) return null;
    return fs.readFileSync(p, "utf8");
  }
}
