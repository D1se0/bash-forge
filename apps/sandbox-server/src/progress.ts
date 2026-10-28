import fs from "node:fs";
import path from "node:path";
import type { ProgressSnapshot } from "@bashforge/shared";

/** Persistencia del progreso: un JSON por forgeId dentro del volumen. */
export class ProgressStore {
  constructor(private readonly dir: string) {
    fs.mkdirSync(dir, { recursive: true });
  }

  private fileOf(forgeId: string): string {
    // forgeId saneado: solo [A-Za-z0-9-_]
    const safe = forgeId.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);
    if (!safe) throw new Error("forgeId inválido");
    return path.join(this.dir, `${safe}.json`);
  }

  save(forgeId: string, snapshotJson: string): boolean {
    try {
      // valida que es JSON razonable antes de escrivir
      const parsed = JSON.parse(snapshotJson) as ProgressSnapshot & { forgeId?: string };
      if (!parsed || typeof parsed !== "object" || typeof parsed.xp !== "number") return false;
      fs.writeFileSync(this.fileOf(forgeId), JSON.stringify(parsed, null, 2));
      return true;
    } catch {
      return false;
    }
  }

  /** Lista los ids de forja con fichero de progreso (ordenados). */
  listAll(): string[] {
    try {
      return fs
        .readdirSync(this.dir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(/\.json$/, ""))
        .sort();
    } catch {
      return [];
    }
  }

  load(forgeId: string): string | null {
    try {
      const f = this.fileOf(forgeId);
      if (!fs.existsSync(f)) return null;
      return fs.readFileSync(f, "utf8");
    } catch {
      return null;
    }
  }
}
