/**
 * Genera docs-site/dist: index.html con el catálogo (de packages/lessons/manifest.json)
 * y una página por nivel. Web estática, sin JS, para GitHub Pages.
 * Identidad nórdica: tokens de @bashforge/ui (copiados a dist) + runas SVG inline.
 * Rutas RELATIVAS para funcionar bajo la base /bash-forge/ de Pages.
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

// tokens + fuentes del sistema de diseño: copiados junto al HTML
fs.copyFileSync(path.join(repo, "packages/ui/src/tokens.css"), path.join(out, "tokens.css"));
let fontsCss = fs.readFileSync(path.join(repo, "packages/ui/src/fonts.css"), "utf8");
// las fuentes copian a dist/fonts; el font-face del paquete usa '/fonts/…' (absoluto)
// → con Pages bajo /bash-forge/ debe ser relativo: fonts/…
fontsCss = fontsCss.replaceAll("url('/fonts/", "url('fonts/");
fs.writeFileSync(path.join(out, "fonts.css"), fontsCss);
fs.cpSync(path.join(repo, "apps/web/public/fonts"), path.join(out, "fonts"), { recursive: true });

// favicon: runa kenaz ᚲ de la forja
const favicon = `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='16' fill='%232e3440'/%3E%3Cpath d='M72 20 L34 50 L74 80' stroke='%2388c0d0' stroke-width='13' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">`;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const kindIcon = { lesson: "ᚱ", challenge: "ᚢ", boss: "ᚦ", playground: "ᛒ" };
const kindLabel = { lesson: "lección", challenge: "reto", boss: "Boss Fight", playground: "playground" };

const byLevel = new Map();
for (const l of lessonList) {
  const lvl = l.level ?? 0;
  if (!byLevel.has(lvl)) byLevel.set(lvl, []);
  byLevel.get(lvl).push(l);
}

// los nueve mundos de Yggdrasil
const MUNDOS = [
  ["Midgard", "Primer contacto", "mannaz"],
  ["Vanaheim", "Variables y parámetros", "fehu"],
  ["Alfheim", "Condicionales", "sowilo"],
  ["Jotunheim", "Bucles y control", "thurisaz"],
  ["Nidavellir", "Funciones y estructura", "ansuz"],
  ["Niflheim", "E/S y procesos", "isa"],
  ["Muspelheim", "Arrays y texto", "kenaz"],
  ["Helheim", "Robustez y ShellCheck", "algiz"],
  ["Asgard", "Proyectos finales", "othala"],
];

const ranks = [
  "Aprendiz de la fragua", "Aprendiz de la fragua", "Ayudante de herrero", "Ayudante de herrero",
  "Herrero", "Herrero", "Herrero de élite", "Herrero de élite", "Maestro Forjador",
];

/** runa SVG inline (trazo currentColor, como el componente Rune de la app) */
function runeSvg(name, size = 22) {
  const paths = RUNES[name];
  if (!paths) return "";
  return `<svg class="mundo-rune" width="${size}" height="${Math.round(size * 1.7)}" viewBox="0 0 100 170" fill="none" aria-hidden="true">${paths
    .map((pts) => `<polyline points="${pts.map(([x, y]) => `${x},${y}`).join(" ")}" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`)
    .join("")}</svg>`;
}

// polilíneas de las runas usadas arriba (coinciden con packages/ui/src/runes.tsx)
const RUNES = {
  fehu: [[[40, 12], [40, 158]], [[40, 52], [70, 30]], [[40, 88], [70, 66]]],
  uruz: [[[28, 152], [28, 40], [62, 14], [62, 152]]],
  thurisaz: [[[42, 12], [42, 158]], [[42, 48], [72, 86], [42, 124], [42, 48]]],
  ansuz: [[[36, 12], [36, 158]], [[36, 26], [70, 46]], [[36, 66], [70, 86]]],
  isa: [[[50, 12], [50, 158]]],
  kenaz: [[[72, 42], [30, 86], [74, 130]]],
  sowilo: [[[64, 14], [35, 50], [64, 86], [35, 122], [64, 156]]],
  algiz: [[[50, 160], [50, 62]], [[50, 62], [31, 34]], [[50, 62], [69, 34]]],
  mannaz: [[[32, 30], [32, 150]], [[68, 30], [68, 150]], [[32, 74], [50, 44], [68, 74]], [[32, 126], [50, 96], [68, 126]]],
  othala: [[[26, 58], [74, 122]], [[74, 58], [26, 122]], [[36, 48], [50, 26], [64, 48]]],
  berkana: [[[34, 10], [34, 160]], [[34, 26], [68, 36], [68, 70], [34, 80]], [[34, 92], [68, 102], [68, 136], [34, 146]]],
};

const sections = [...byLevel.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([lvl, ls]) => {
    const [nombre, tagline, rune] = MUNDOS[lvl] ?? [`Mundo ${lvl}`, "", "berkana"];
    return `
    <section id="nivel-${lvl}" class="mundo">
      <div class="mundo-head">
        ${runeSvg(rune, 20)}
        <div>
          <h2>${esc(nombre)} <span class="rank">${lvl} · ${esc(ranks[lvl] ?? "")}</span></h2>
          <p class="tagline">${esc(tagline)}</p>
        </div>
      </div>
      <ul>
        ${ls.map((l) => `<li>
          <span class="kind">${kindIcon[l.kind] ?? "ᚱ"} ${kindLabel[l.kind] ?? "lección"}</span>
          <strong>${esc(l.title)}</strong>
          <span class="xp">★ ${l.xp} XP</span>
        </li>`).join("\n")}
      </ul>
    </section>`;
  })
  .join("\n");

const toc = [...byLevel.keys()].sort((a, b) => a - b)
  .map((lvl) => `<a href="#nivel-${lvl}">${MUNDOS[lvl]?.[0] ?? `L${lvl}`}</a>`)
  .join("");

const total = manifest.counts?.total ?? lessonList.length;

const html = `<!doctype html>
<html lang="es" data-theme="dark">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="description" content="Bash Forge — aprende Bash scripting de verdad en una terminal real, con ${total} lecciones validadas en Ubuntu. Nórdico, sobrio, con brasa."/>
<meta property="og:title" content="Bash Forge — aprende Bash forjando scripts de verdad"/>
<meta property="og:description" content="Terminal web real (Ubuntu + Docker), ${total} lecciones, ${manifest.counts?.boss ?? 0} Boss Fights. Validación automática. Open source."/>
<meta property="og:type" content="website"/>
<title>Bash Forge — la forja bajo la aurora</title>
${favicon}
<link rel="stylesheet" href="fonts.css"/>
<link rel="stylesheet" href="tokens.css"/>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0 auto; max-width: 820px; padding: 0 24px 48px;
    background: var(--bg-abyss); color: var(--fg);
    font-family: var(--font-sans); line-height: var(--ui-lh);
  }
  /* cenefa de nudos + hero */
  .knot { height: 6px; margin: 0 0 32px;
    background: repeating-linear-gradient(90deg, var(--border) 0 2px, transparent 2px 10px, var(--ice-3) 10px 12px, transparent 12px 20px);
    opacity: .5; border-radius: 2px; }
  h1 { font-family: var(--font-serif); font-weight: 560; font-size: var(--fs-6); color: var(--fg-strong); margin: 24px 0 8px; letter-spacing: .3px; }
  .brand { font-family: var(--font-mono); color: var(--ice-3); display: inline-flex; align-items: center; gap: 10px; font-size: 15px; margin-top: 28px; }
  .brand svg { color: var(--ice-2); }
  .brand em { font-style: normal; color: var(--ember); }
  .sub { color: var(--fg-muted); max-width: 58ch; margin: 0 0 20px; }
  .kpis { display: flex; gap: 14px; flex-wrap: wrap; margin: 18px 0 8px; }
  .kpi { border: 1px solid var(--border-soft); background: var(--bg-surface); color: var(--fg-strong);
    border-radius: var(--r-md); padding: 10px 18px; font-family: var(--font-mono); font-size: 14px; }
  .kpi b { color: var(--ice-2-text); font-weight: 700; }
  nav { margin: 22px 0 34px; display: flex; flex-wrap: wrap; gap: 6px; }
  nav a { color: var(--ice-2-text); text-decoration: none; font-size: 13px;
    border: 1px solid var(--border-soft); border-radius: 999px; padding: 5px 13px; background: var(--bg-surface); }
  nav a:hover { border-color: var(--ice-3); box-shadow: var(--glow-ice); }
  /* mundos */
  .mundo { margin: 34px 0; }
  .mundo-head { display: flex; gap: 14px; align-items: center; margin-bottom: 10px; }
  .mundo-rune { color: var(--ice-2); flex: none; }
  .mundo-head h2 { margin: 0; font-family: var(--font-serif); font-weight: 560; font-size: var(--fs-4); color: var(--fg-strong); }
  .mundo-head .rank { color: var(--fg-faint); font-family: var(--font-sans); font-weight: 400; font-size: 13px; margin-left: 8px; }
  .tagline { margin: 2px 0 0; color: var(--fg-faint); font-size: 13px; font-style: italic; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { display: flex; align-items: baseline; gap: 10px;
    border: 1px solid var(--border-soft); border-radius: var(--r-sm);
    background: var(--bg-surface); padding: 9px 14px; margin: 6px 0; }
  li:hover { border-color: var(--ice-3); }
  .kind { font-size: .82em; color: var(--fg-faint); font-family: var(--font-mono); flex: none; min-width: 96px; }
  li strong { color: var(--fg-strong); font-weight: 620; }
  li.boss strong { color: var(--ember-text); }
  .xp { margin-left: auto; color: var(--aurora-v-text); font-size: .82em; font-family: var(--font-mono); flex: none; }
  footer { margin-top: 46px; color: var(--fg-faint); border-top: 1px solid var(--border-soft); padding-top: 14px; font-size: 13px; }
  footer a { color: var(--ice-2-text); }
  .cta { display: inline-block; margin: 6px 0 8px; padding: 10px 20px; border-radius: var(--r-sm);
    background: var(--ember); color: var(--ember-contrast); font-weight: 700; text-decoration: none; }
  .cta:hover { box-shadow: var(--glow-ember); }
  .cta-alt { background: var(--ice-4); color: var(--fg-strong); margin-left: 10px; }
  code { font-family: var(--font-mono); }
  @media (prefers-color-scheme: light) { html[data-theme="dark"] { /* Pages sin JS: la web respeta el tema del visitante vía archivo? no — se sirve dark */ } }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>
</head>
<body>
<div class="knot"></div>
<p class="brand">${runeSvg("kenaz", 14)} bash<span>·</span>forge <em>ᚲ</em></p>
<h1>La forja bajo la aurora</h1>
<p class="sub">Aprende <strong>Bash scripting exclusivamente</strong>, escribiendo y ejecutando scripts de verdad en un Ubuntu real dentro de Docker. Una terminal web con acabado nórdico: hielo frío, brasa cálida, cero humo.</p>
<div class="kpis">
  <span class="kpi"><b>${total}</b> lecciones</span>
  <span class="kpi"><b>${manifest.counts?.challenge ?? 0}</b> retos</span>
  <span class="kpi"><b>${manifest.counts?.boss ?? 0}</b> Boss Fights</span>
  <span class="kpi"><b>9</b> mundos</span>
</div>
<p>
  <a class="cta" href="https://github.com/D1se0/bash-forge#instalación">ᚲ Empezar a forjar</a>
  <a class="cta cta-alt" href="https://github.com/D1se0/bash-forge">Código fuente</a>
</p>
<nav>${toc}</nav>
${sections}
<footer><small>Generado desde <code>packages/lessons</code> — Bash Forge (MIT). Los KPI y el catálogo salen del build real: no hay cifras inventadas.</small></footer>
</body>
</html>`;

fs.writeFileSync(path.join(out, "index.html"), html);
// 404 para Pages
fs.copyFileSync(path.join(out, "index.html"), path.join(out, "404.html"));
console.log(`✔ docs-site/dist/index.html (${lessonList.length} lecciones, ${byLevel.size} mundos, tokens + fuentes nórdicos incluidos)`);
