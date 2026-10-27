/**
 * Genera docs-site/dist: index.html con el catálogo (de packages/lessons/manifest.json)
 * y una página por nivel. Web estática, sin JS, para GitHub Pages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repo = path.resolve(root, "..");
const out = path.join(root, "dist");
fs.mkdirSync(out, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(path.join(repo, "packages/lessons/manifest.json"), "utf8"));
const lessonList = manifest.lessons ?? Object.values(manifest).flat?.() ?? [];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const kindIcon = { lesson: "📘", challenge: "⚔️", boss: "👹", playground: "🛠" };

const byLevel = new Map();
for (const l of lessonList) {
  const lvl = l.level ?? 0;
  if (!byLevel.has(lvl)) byLevel.set(lvl, []);
  byLevel.get(lvl).push(l);
}

const ranks = [
  "Aprendiz de la fragua", "Aprendiz de la fragua", "Ayudante de herrero", "Ayudante de herrero",
  "Herrero", "Herrero", "Herrero de élite", "Herrero de élite", "Maestro Forjador",
];

const sections = [...byLevel.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([lvl, ls]) => `
    <section id="nivel-${lvl}">
      <h2>Nivel ${lvl} <span class="rank">${esc(ranks[lvl] ?? "")}</span></h2>
      <ul>
        ${ls.map((l) => `<li>
          <span class="kind">${kindIcon[l.kind] ?? ""} ${esc(l.kind ?? "lesson")}</span>
          <strong>${esc(l.title)}</strong>
          <span class="xp">⭐ ${l.xp} XP</span>
        </li>`).join("\n")}
      </ul>
    </section>`).join("\n");

const toc = [...byLevel.keys()].sort((a, b) => a - b)
  .map((lvl) => `<a href="#nivel-${lvl}">L${lvl}</a>`)
  .join(" · ");

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Bash Forge — catálogo del currículum</title>
<style>
  :root { color-scheme: dark; }
  body { background: #0b0f19; color: #d1d5db; font-family: system-ui, sans-serif; margin: 0 auto; max-width: 860px; padding: 24px; }
  a { color: #38bdf8; }
  h1 { color: #f59e0b; } .rank { color: #6b7280; font-weight: 400; font-size: .8em; }
  ul { list-style: none; padding: 0; } li { border-left: 3px solid #1f2937; padding: 8px 12px; margin: 6px 0; }
  .kind { font-size: .8em; color: #6b7280; margin-right: 8px; }
  .xp { color: #f59e0b; font-size: .8em; margin-left: 8px; }
  .obj { color: #94a3b8; margin: 2px 0 0; font-size: .9em; }
  nav { background: #111827; padding: 8px 12px; border-radius: 8px; }
</style>
</head>
<body>
<h1>🔥 Bash Forge — ${manifest.counts?.total ?? lessonList.length} lecciones, ${manifest.counts?.boss ?? 0} Boss Fights</h1>
<p>Aprende Bash de verdad: ${esc(manifest.counts?.lesson ?? "")} lecciones + ${manifest.counts?.challenge ?? 0} retos + ${esc(manifest.counts?.boss ?? "")} bosses, validados automáticamente en una terminal real.</p>
<nav>${toc}</nav>
${sections}
<footer><small>Generado desde packages/lessons — Bash Forge (MIT).</small></footer>
</body>
</html>`;

fs.writeFileSync(path.join(out, "index.html"), html);
// 404 para Pages
fs.copyFileSync(path.join(out, "index.html"), path.join(out, "404.html"));
console.log(`✔ docs-site/dist/index.html (${lessonList.length} lecciones incluidas)`);
