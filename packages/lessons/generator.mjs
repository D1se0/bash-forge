/**
 * Generador del currículum Bash Forge.
 * Lee `levels/*.yaml` (specs en YAML: texto libre con backticks y ${seguro})
 * y produce `lessons/<id>/` con lesson.yaml, lesson.md, hints.md, solution.sh
 * y setup.sh, además de `manifest.json` (lo consumen docs y CI).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  parse as yamlParse,
  stringify as yamlStringify,
} from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEVELS_DIR = path.join(__dirname, "levels");
const OUT_DIR = path.join(__dirname, "lessons");

const RANKS = [
  "Aprendiz de la fragua",
  "Ayudante de herrero",
  "Herrero",
  "Herrero de élite",
  "Maestro Forjador",
];

function rankFor(level) {
  return RANKS[Math.min(4, Math.floor(level / 2))];
}

function lessonMarkdown(spec) {
  const parts = [`# ${spec.title}\n`];
  parts.push(`> **Objetivo:** ${spec.objective}\n`);
  parts.push(`## Teoría\n\n${(spec.theory ?? "").trim()}\n`);
  if (spec.example) parts.push(`## Ejemplo guiado\n\n${spec.example.trim()}\n`);
  parts.push(`## Tu reto\n\n${spec.exercise.trim()}\n`);
  if (spec.errors?.length) {
    // un ítem sin comillas con «: » llega del YAML como Mapa {clave: resto}:
    // lo recuperamos a su texto «clave: resto» (evita el [object Object] en el panel)
    const asText = (e) =>
      typeof e === "string" ? e : Object.entries(e).map(([k, v]) => `${k}: ${String(v).trim()}`).join(": ");
    parts.push(`## Errores típicos\n\n${spec.errors.map((e) => `- ${asText(e)}`).join("\n")}\n`);
  }
  if (spec.quiz) {
    parts.push(
      `## Mini-quiz\n\n${String(spec.quiz.question ?? "")}\n\n<details><summary>Ver respuesta</summary>\n\n${String(spec.quiz.answer ?? "")}\n\n</details>\n`,
    );
  }
  if (spec.extra) parts.push(spec.extra.trim() + "\n");
  parts.push(
    `---\n\n*~${spec.minutes} min · Nivel ${spec.level} (${rankFor(spec.level)}) · pulsa **Comprobar** cuando lo tengas.*\n`,
  );
  return parts.join("\n");
}

function hintsMarkdown(hints) {
  // mismo rescate que en errores: un ítem sin comillas con «: » llega como Mapa
  const asText = (h) =>
    typeof h === "string" ? h.trim() : Object.entries(h).map(([k, v]) => `${k}: ${String(v).trim()}`).join(": ");
  const labels = ["Primera pista", "Segunda pista", "Tercera pista"];
  return hints
    .map((h, i) => `${labels[i] ?? `Pista ${i + 1}`}\n\n${asText(h ?? "")}`)
    .join("\n---\n");
}

function buildLesson(spec) {
  const dir = path.join(OUT_DIR, spec.id);
  fs.mkdirSync(dir, { recursive: true });

  const tasks = (spec.tasks ?? []).map((t) => {
    const clean = { name: t.name, message: t.message };
    if (t.hint) clean.hint = t.hint;
    if (t.cmd) clean.cmd = t.cmd;
    for (const k of [
      "expectExit",
      "expectOutput",
      "expectOutputAbsent",
      "expectFile",
      "expectExecutable",
      "expectFileContains",
      "seed",
    ]) {
      if (t[k] !== undefined) clean[k] = t[k];
    }
    return clean;
  });

  const meta = {
    id: spec.id,
    title: spec.title,
    level: spec.level,
    kind: spec.kind ?? "lesson",
    xp: spec.xp ?? 10,
    ...(spec.track ? { track: spec.track } : {}),
    estimated_minutes: spec.minutes ?? 7,
    prerequisites: spec.prereq ?? [],
    tags: spec.tags ?? [],
    objective: spec.objective ?? "",
    files_to_create: spec.files ?? [],
    validation: {
      mode: spec.mode ?? "declarative",
      timeout_seconds: spec.timeoutSeconds ?? 30,
      tasks,
    },
  };
  fs.writeFileSync(path.join(dir, "lesson.yaml"), yamlStringify(meta, { lineWidth: 120 }));
  fs.writeFileSync(path.join(dir, "lesson.md"), lessonMarkdown(spec));
  fs.writeFileSync(path.join(dir, "hints.md"), hintsMarkdown(spec.hints ?? []));

  if (spec.solution) {
    const sol = spec.solution.trim() + "\n";
    fs.writeFileSync(path.join(dir, "solution.sh"), sol, { mode: 0o755 });
  }
  if (spec.setup) {
    fs.writeFileSync(path.join(dir, "setup.sh"), spec.setup.trim() + "\n", { mode: 0o755 });
  }
  return { id: spec.id, level: spec.level, kind: meta.kind, xp: meta.xp, title: spec.title };
}

function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const levelFiles = fs.readdirSync(LEVELS_DIR).filter((f) => f.endsWith(".yaml")).sort();
  // el pack de práctica va también en levels/ pero no es un nivel: el web lo separa por track
  const practiceFile = levelFiles.indexOf("practice.yaml");
  if (practiceFile >= 0) levelFiles.splice(practiceFile, 1);
  const byLevel = new Map(); // level → []
  for (const file of levelFiles) {
    const doc = yamlParse(fs.readFileSync(path.join(LEVELS_DIR, file), "utf8"));
    for (const spec of doc.lessons ?? []) {
      const arr = byLevel.get(spec.level) ?? [];
      arr.push(spec);
      byLevel.set(spec.level, arr);
    }
  }

  const ordered = [...byLevel.keys()].sort((a, b) => a - b);
  const log = [];
  for (const level of ordered) {
    let previous = null;
    for (const spec of byLevel.get(level)) {
      // prerequisito automático: la anterior de este nivel
      if (!spec.prereq && previous) spec.prereq = [previous];
      buildLesson(spec);
      previous = spec.id;
      log.push({ id: spec.id, level: spec.level, kind: spec.kind ?? "lesson", xp: spec.xp ?? 10, title: spec.title });
    }
  }

  // valida prerequisitos
  const ids = new Set(log.map((l) => l.id));
  for (const l of log) for (const p of byLevel.get(l.level) ?? []) for (const pr of p.prereq ?? []) {
    if (!ids.has(pr)) throw new Error(`Prerequisito inexistente ${pr} (en ${p.id})`);
  }

  // pista de práctica dirigida: compilar al margen, sin prereqs automáticos,
  // fuera del manifest (sólo el camino L0→L9 lo alimenta)
  const practiceDoc = yamlParse(fs.readFileSync(path.join(LEVELS_DIR, "practice.yaml"), "utf8"));
  const practiceIds = new Set();
  for (const spec of practiceDoc.lessons ?? []) {
    if (!spec.track) throw new Error(`Lección de práctica sin track: ${spec.id}`);
    buildLesson(spec);
    practiceIds.add(spec.id);
    // entra en el log (con track) para que docs-site pueda pintar la sección de práctica
    log.push({ id: spec.id, level: spec.level, kind: spec.kind ?? "lesson", xp: spec.xp ?? 10, title: spec.title, track: spec.track });
  }

  fs.writeFileSync(
    path.join(__dirname, "manifest.json"),
    JSON.stringify(
      {
        version: 1,
        counts: {
          total: log.length,
          lesson: log.filter((l) => l.kind === "lesson" && !l.track).length,
          challenge: log.filter((l) => l.kind === "challenge").length,
          boss: log.filter((l) => l.kind === "boss").length,
          practice: practiceIds.size,
        },
        lessons: log,
      },
      null,
      2,
    ),
  );
  const counts = log.reduce((acc, l) => {
    if (l.track) return acc;
    acc[l.kind] = (acc[l.kind] ?? 0) + 1;
    return acc;
  }, {});
  console.log(
    `✔ ${log.filter((l) => !l.track).length} lecciones del camino + ${practiceIds.size} de práctica generadas:`,
    counts,
  );
}

main();
