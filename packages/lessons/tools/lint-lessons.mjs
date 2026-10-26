#!/usr/bin/env node
/**
 * Lint del currículum: valida estructura de todas las lecciones generadas.
 * Verde si: ids únicos, nivel dentro de 0..8, tasks con name+cmd, regex compilables.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../lessons");
let failures = 0;
const ids = new Set();

for (const id of fs.readdirSync(dir)) {
  const full = path.join(dir, id);
  if (!fs.statSync(full).isDirectory()) continue;
  const yml = path.join(full, "lesson.yaml");
  if (!fs.existsSync(yml)) {
    continue; // reto script-mode sin yaml nuevo
  }
  const meta = parse(fs.readFileSync(yml, "utf8"));
  const label = `${id}`;
  try {
    if (!meta.id || !meta.title || typeof meta.level !== "number") throw new Error("faltan id/title/level");
    if (meta.level < 0 || meta.level > 8) throw new Error("level fuera de rango");
    if (ids.has(meta.id)) throw new Error("id duplicado");
    ids.add(meta.id);
    if ((meta.xp ?? 0) <= 0) throw new Error("xp inválido");
    for (const task of meta.validation?.tasks ?? []) {
      const asserts = task.cmd || task.expectFile || task.expectExecutable || task.expectFileContains;
      if (!task.name || !asserts) throw new Error(`task sin name ni aserciones: ${JSON.stringify(task)}`);
      for (const key of ["expectOutput", "expectOutputAbsent"]) {
        if (task[key]) new RegExp(task[key]);
      }
      if (task.expectFileContains) new RegExp(task.expectFileContains.regex);
    }
  } catch (e) {
    failures++;
    console.error(`✖ ${label}: ${e.message}`);
  }
}

console.log(`${failures === 0 ? "✔" : "✖"} lint-lessons: ${ids.size} lecciones, ${failures} problemas`);
process.exit(failures === 0 ? 0 : 1);
