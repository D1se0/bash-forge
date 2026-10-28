/**
 * Genera docs-site/dist: landing del producto + catálogo de lecciones
 * (de packages/lessons/manifest.json). Web estática, sin JS, para GitHub Pages.
 * Estructura tipo bash-arena: navbar fija · hero + demo de terminal ·
 * tarjetas de características · quickstart · mundos · footer.
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
const kindLabel = { lesson: "lección", challenge: "reto", boss: "Boss", playground: "playground" };

const byLevel = new Map();
for (const l of lessonList) {
  // la práctica dirigida (con track) va fuera del camino: su propia sección
  if (l.track) continue;
  const lvl = l.level ?? 0;
  if (!byLevel.has(lvl)) byLevel.set(lvl, []);
  byLevel.get(lvl).push(l);
}

/* ---------- práctica dirigida (IF, FOR, WHILE, CASE…) ---------- */
const TRACK_TITLES = {
  IF: "Condicionales if",
  FOR: "Bucles for",
  WHILE: "while y until",
  CASE: "case y menús",
};
const practiceList = lessonList.filter((l) => l.track);
const byTrack = new Map();
for (const l of practiceList) {
  const t = l.track;
  if (!byTrack.has(t)) byTrack.set(t, []);
  byTrack.get(t).push(l);
}
const TRACK_ORDER = [...Object.keys(TRACK_TITLES), ...[...byTrack.keys()].filter((t) => !(t in TRACK_TITLES))];

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

const REPO_URL = "https://github.com/D1se0/bash-forge";

/* ---------- secciones del catálogo (por mundo) ---------- */
const sections = [...byLevel.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([lvl, ls]) => {
    const [nombre, tagline, rune] = MUNDOS[lvl] ?? [`Mundo ${lvl}`, "", "berkana"];
    const mins = ls.reduce((acc, l) => acc + (l.minutes ?? 0), 0);
    const stats = [`${ls.length} lecciones`, mins > 0 ? `~${mins} min` : null].filter(Boolean).join(" · ");
    return `
    <section id="nivel-${lvl}" class="mundo">
      <div class="mundo-head">
        ${runeSvg(rune, 18)}
        <div>
          <h2>${esc(nombre)} <span class="rank">${lvl} · ${esc(ranks[lvl] ?? "")}</span></h2>
          <p class="tagline">${esc(tagline)} · ${stats}</p>
        </div>
      </div>
      <ul>
        ${ls.map((l) => `<li class="${esc(l.kind ?? "lesson")}">
          <span class="kind">${kindIcon[l.kind] ?? "ᚱ"} ${kindLabel[l.kind] ?? "lección"}</span>
          <strong>${esc(l.title)}</strong>
          <span class="xp">★ ${l.xp} XP</span>
        </li>`).join("\n")}
      </ul>
    </section>`;
  })
  .join("\n");

/* ---------- sección de práctica dirigida ---------- */
const practiceSection = byTrack.size
  ? `
    <section id="practica" class="mundo practica">
      <div class="mundo-head">
        ${runeSvg("berkana", 18)}
        <div>
          <h2>Práctica dirigida <span class="rank">tracks · ${practiceList.length} lecciones</span></h2>
          <p class="tagline">Entrena un solo tema al salto: sin candados y fuera del camino L0→L9.</p>
        </div>
      </div>
      ${TRACK_ORDER.filter((t) => byTrack.has(t))
        .map(
          (t) => `
      <div class="track-block">
        <h3><span class="track-chip">${esc(t)}</span> ${esc(TRACK_TITLES[t] ?? t)}</h3>
        <ul>
          ${(byTrack.get(t) ?? [])
            .map(
              (l) => `<li class="${esc(l.kind ?? "lesson")}">
            <span class="kind">${kindIcon[l.kind] ?? "ᚱ"} ${kindLabel[l.kind] ?? "lección"}</span>
            <strong>${esc(l.title)}</strong>
            <span class="xp">★ ${l.xp} XP</span>
          </li>`,
            )
            .join("\n")}
        </ul>
      </div>`,
        )
        .join("\n")}
    </section>`
  : "";

/* ---------- nav de mundos ---------- */
const toc =
  [...byLevel.keys()]
    .sort((a, b) => a - b)
    .map((lvl) => `<a href="#nivel-${lvl}">${MUNDOS[lvl]?.[0] ?? `L${lvl}`}</a>`)
    .join("") + (byTrack.size ? `<a href="#practica">Práctica</a>` : "");

/* ---------- tarjetas de características ---------- */
const features = [
  ["Terminal real", "Un Ubuntu de verdad corriendo en Docker, con PTY por pestaña. No hay simulación: cada comando se ejecuta de verdad.", "ᚦ"],
  ["Lecciones validadas", "Cada reto se comprueba por aserciones automáticas: salida exacta, ficheros, permisos y comandos usados.", "ᚱ"],
  ["Boss Fights", "Cada nivel culmina en un examen práctico todo-junto. Derrota al Boss y desbloquea el siguiente mundo.", "ᚢ"],
  ["XP · rangos · racha", "De Aprendiz de la fragua a Maestro Forjador. La racha diaria y las insignias premian la constancia.", "ᛝ"],
  ["nano + ShellCheck", "Editor nano con sintaxis bash coloreada y linter integrado (forge-lint). Tu código se corrige mientras lo escribes.", "ᛚ"],
  ["Nórdico de verdad", "Tokens AA de contraste, tema Día de Nieve / Noche de Fiordo, runas kenaz y tipografías Inter Tight + Fraunces.", "ᚲ"],
];
const featuresHtml = features
  .map(([t, d, r]) => `
  <article class="feat">
    <span class="feat-rune">${r}</span>
    <h3>${t}</h3>
    <p>${d}</p>
  </article>`)
  .join("\n");

const total = manifest.counts?.total ?? lessonList.length;
const totalMin = lessonList.reduce((acc, l) => acc + (l.minutes ?? 0), 0);

const html = `<!doctype html>
<html lang="es" data-theme="dark">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="description" content="Bash Forge — aprende Bash scripting de verdad en una terminal real, con ${total} lecciones validadas en Ubuntu. Nórdico, sobrio, con brasa."/>
<meta property="og:title" content="Bash Forge — aprende Bash forjando scripts de verdad"/>
<meta property="og:description" content="Terminal web real (Ubuntu + Docker), ${total} lecciones, ${manifest.counts?.boss ?? 0} Boss Fights. Validación automática. Open source."/>
<meta property="og:type" content="website"/>
<title>Bash Forge — aprende Bash forjando scripts de verdad</title>
${favicon}
<link rel="stylesheet" href="fonts.css"/>
<link rel="stylesheet" href="tokens.css"/>
<style>
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  /* ---------- animaciones (respetan prefers-reduced-motion) ---------- */
  @keyframes fade-up { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  @keyframes rune-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 0 rgb(136 192 208 / 0); }
    50% { box-shadow: 0 0 18px color-mix(in srgb, var(--ice-3) 55%, transparent); }
  }
  .hero > div { animation: fade-up .7s ease both; }
  .hero .term-card { animation: fade-up .7s ease .15s both; }
  .mundo-rune { animation: rune-float 5s ease-in-out infinite; }
  .btn-primary { animation: glow-pulse 3.4s ease-in-out 1.2s infinite; }
  /* demo de terminal: líneas que aparecen una a una + cursor con parpadeo */
  .term-body > div { opacity: 0; animation: fade-in .32s ease both; }
  .term-body > div:nth-child(1) { animation-delay: .3s; }
  .term-body > div:nth-child(2) { animation-delay: .7s; }
  .term-body > div:nth-child(3) { animation-delay: 1.1s; }
  .term-body > div:nth-child(4) { animation-delay: 1.5s; }
  .term-body > div:nth-child(5) { animation-delay: 1.9s; }
  .term-body > div:nth-child(6) { animation-delay: 2.3s; }
  .term-body > div:nth-child(7) { animation-delay: 2.7s; }
  .term-caret {
    display: inline-block; width: 8px; height: 1.05em; vertical-align: text-bottom;
    background: var(--ice-2); animation: blink 1.1s step-end infinite;
  }
  /* reveal on scroll sin JS (progressive enhancement; si el navegador no lo
     entiende, las secciones quedan visibles igualmente) */
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .feat, .mundo, .quick, .step, li {
        animation: fade-up .55s ease both;
        animation-timeline: view();
        animation-range: entry 0% entry 42%;
      }
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero > div, .hero .term-card, .term-body > div { animation: none !important; opacity: 1 !important; }
  }
  body {
    margin: 0; background: var(--bg-abyss); color: var(--fg);
    font-family: var(--font-sans); line-height: var(--ui-lh);
  }
  a { color: inherit; }
  .wrap { max-width: 1020px; margin: 0 auto; padding: 0 24px; }

  /* ---------- navbar fija ---------- */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 40;
    background: color-mix(in srgb, var(--bg-abyss) 86%, transparent);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-soft);
  }
  .navbar .wrap { display: flex; align-items: center; gap: 26px; height: 58px; }
  .brand { display: inline-flex; align-items: center; gap: 9px; text-decoration: none;
    font-weight: 700; font-size: 15.5px; color: var(--fg-strong); }
  .brand svg { color: var(--ice-2); }
  .brand em { font-style: normal; color: var(--ember); }
  .navbar nav { margin-left: auto; display: flex; align-items: center; gap: 4px; flex-wrap: nowrap; }
  .navbar nav a { text-decoration: none; color: var(--fg-muted); font-size: 13.5px; padding: 7px 12px; border-radius: var(--r-sm); white-space: nowrap; }
  .navbar nav a:hover { color: var(--fg-strong); background: var(--bg-surface); }
  .navbar .nav-cta {
    background: var(--ice-4); color: var(--fg-strong); font-weight: 650;
    border-radius: var(--r-sm); padding: 8px 16px; text-decoration: none; margin-left: 8px; white-space: nowrap;
  }
  .navbar .nav-cta:hover { background: var(--ice-3); box-shadow: var(--glow-ice); }

  /* ---------- hero ---------- */
  .hero { padding: 118px 0 30px; display: grid; grid-template-columns: minmax(0,1.05fr) minmax(0,.95fr); gap: 40px; align-items: center; }
  .hero h1 {
    font-family: var(--font-serif); font-weight: 560; font-size: var(--fs-7);
    color: var(--fg-strong); margin: 0 0 18px; letter-spacing: .3px; line-height: 1.08;
  }
  .hero h1 .hl {
    background: linear-gradient(100deg, var(--ice-2), var(--aurora-v));
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .hero .lead { color: var(--fg-muted); font-size: 16.5px; max-width: 52ch; margin: 0 0 26px; }
  .hero .lead strong { color: var(--fg-strong); }
  .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
  .btn { display: inline-block; padding: 12px 22px; border-radius: var(--r-sm); font-weight: 700; text-decoration: none; font-size: 14.5px; }
  .btn-primary { background: var(--ice-4); color: var(--fg-strong); }
  .btn-primary:hover { background: var(--ice-3); box-shadow: var(--glow-ice); }
  .btn-ghost { background: var(--bg-surface); color: var(--fg-strong); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--ice-3); }
  .hero-note { margin-top: 22px; color: var(--fg-faint); font-size: 13px; display: flex; gap: 18px; flex-wrap: wrap; }
  .hero-note span { font-family: var(--font-mono); }

  /* demo de terminal */
  .term-card {
    background: #14161c; border: 1px solid var(--border); border-radius: 12px;
    box-shadow: 0 24px 60px rgb(0 0 0 / .45), var(--shadow-blue); overflow: hidden;
  }
  .term-bar { display: flex; gap: 7px; padding: 11px 14px; border-bottom: 1px solid #23262e; }
  .term-bar i { width: 10px; height: 10px; border-radius: 50%; background: #2e3440; }
  .term-bar i:nth-child(1) { background: #bf616a; } .term-bar i:nth-child(2) { background: #ebcb8b; } .term-bar i:nth-child(3) { background: #a3be8c; }
  .term-body { font-family: var(--font-mono); font-size: 13.2px; line-height: 1.75; padding: 16px 18px 20px; }
  .t-prompt { color: #88c0d0; } .t-cmd { color: #eceff4; } .t-out { color: #96a3b4; }
  .t-str { color: #a3be8c; } .t-key { color: #b48ead; } .t-ok { color: #a3be8c; font-weight: 700; } .t-xp { color: #ebcb8b; }

  /* ---------- quickstart ---------- */
  .quick { margin: 44px 0 10px; }
  .quick h2, .sec-title {
    font-family: var(--font-serif); font-weight: 560; color: var(--fg-strong);
    font-size: var(--fs-5); margin: 0 0 16px; letter-spacing: .3px;
  }
  .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
  .step { background: var(--bg-surface); border: 1px solid var(--border-soft); border-radius: var(--r-md); padding: 15px 17px; }
  .step b { display: inline-flex; align-items: center; gap: 8px; color: var(--fg-strong); margin-bottom: 8px; }
  .step .n { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px;
    border-radius: 6px; background: var(--ice-4); color: var(--fg-strong); font-family: var(--font-mono); font-size: 12px; }
  .step code { display: block; font-family: var(--font-mono); font-size: 12.6px; color: var(--ice-2-text);
    background: var(--bg-abyss); border: 1px solid var(--border-soft); border-radius: 8px; padding: 9px 12px; white-space: pre-wrap; }

  /* ---------- features ---------- */
  .features { padding: 40px 0 16px; }
  .feat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; }
  .feat { background: var(--bg-surface); border: 1px solid var(--border-soft); border-radius: var(--r-md); padding: 20px; }
  .feat:hover { border-color: var(--ice-3); }
  .feat-rune { font-size: 21px; color: var(--ice-2); display: inline-block; margin-bottom: 10px; }
  .feat h3 { margin: 0 0 7px; color: var(--fg-strong); font-size: 15.5px; letter-spacing: .2px; }
  .feat p { margin: 0; color: var(--fg-muted); font-size: 13.6px; }

  /* ---------- mundos / catálogo ---------- */
  .mundos { padding: 40px 0 10px; }
  nav.worlds { margin: 4px 0 22px; display: flex; flex-wrap: wrap; gap: 6px; }
  nav.worlds a { color: var(--ice-2-text); text-decoration: none; font-size: 13px;
    border: 1px solid var(--border-soft); border-radius: 999px; padding: 5px 13px; background: var(--bg-surface); }
  nav.worlds a:hover { border-color: var(--ice-3); box-shadow: var(--glow-ice); }
  .mundo { margin: 30px 0; }
  .mundo.practica { border-top: 1px dashed var(--border-soft); padding-top: 8px; }
  .track-block { margin: 18px 0 6px; }
  .track-block h3 { margin: 0 0 4px; font-family: var(--font-sans); font-size: 14.5px; color: var(--fg-strong); display: flex; align-items: center; gap: 8px; }
  .track-chip { font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .8px;
    color: var(--ice-2-text); border: 1px solid var(--ice-3); border-radius: 6px; padding: 1px 7px; }
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
  .kind { font-size: .82em; color: var(--fg-faint); font-family: var(--font-mono); flex: none; min-width: 84px; }
  li strong { color: var(--fg-strong); font-weight: 620; }
  li.boss { border-color: var(--border); background: linear-gradient(120deg, var(--bg-surface), var(--bg-raised)); }
  li.boss strong { color: var(--ember-text); }
  .xp { margin-left: auto; color: var(--aurora-v-text); font-size: .82em; font-family: var(--font-mono); flex: none; }

  /* ---------- footer ---------- */
  footer { margin-top: 50px; color: var(--fg-faint); border-top: 1px solid var(--border-soft); padding: 18px 0 30px; font-size: 13px; }
  footer .wrap { display: flex; gap: 18px; flex-wrap: wrap; align-items: center; }
  footer a { color: var(--ice-2-text); }
  @media (max-width: 880px) {
    .hero { grid-template-columns: 1fr; padding-top: 96px; }
    .navbar nav a { display: none; }
    .navbar .nav-cta { margin-left: auto; }
  }
  @media (prefers-color-scheme: light) { html[data-theme="dark"] { /* Pages sin JS: se sirve el tema nórdico oscuro */ } }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; scroll-behavior: auto !important; } }
</style>
</head>
<body>

<header class="navbar">
  <div class="wrap">
    <a class="brand" href="#top">${runeSvg("kenaz", 13)} bash·forge <em>ᚲ</em></a>
    <nav>
      <a href="#caracteristicas">Características</a>
      <a href="#quickstart">Instalación</a>
      <a href="#mundos">Los 9 mundos</a>
    </nav>
    <a class="nav-cta" href="${REPO_URL}#instalación">ᚲ Empezar a forjar</a>
  </div>
</header>

<main id="top">
  <div class="wrap">
    <section class="hero">
      <div>
        <h1>Aprende Bash <span class="hl">forjando scripts</span>, no memorizando flags</h1>
        <p class="lead">
          Cada lección se practica en una <strong>terminal real de Ubuntu</strong> dentro de Docker,
          y se valida sola: tu script corre, tus ficheros existen, tu salida es la esperada.
          ${total} lecciones, ${manifest.counts?.challenge ?? 0} retos y ${manifest.counts?.boss ?? 0} Boss Fights repartidos en 9 mundos
          (${totalMin > 0 ? `~${totalMin} min de práctica` : "niveles con retos y Boss Fights"}).
        </p>
        <div class="hero-ctas">
          <a class="btn btn-primary" href="${REPO_URL}#instalación">Empezar a forjar</a>
          <a class="btn btn-ghost" href="#mundos">Ver el catálogo</a>
        </div>
        <div class="hero-note">
          <span>✓ open source (MIT)</span><span>✓ sin cuenta</span><span>✓ 100% local</span>
        </div>
      </div>
      <div class="term-card" role="img" aria-label="Demo: solucionar una lección en la terminal">
        <div class="term-bar"><i></i><i></i><i></i></div>
        <div class="term-body">
          <div><span class="t-prompt">herrero@forja</span> <span class="t-key">~</span> <span class="t-cmd">nano saludo.sh</span></div>
          <div><span class="t-out"># escribes el script con la sintaxis coloreada…</span></div>
          <div><span class="t-prompt">herrero@forja</span> <span class="t-cmd">forge-lint saludo.sh</span></div>
          <div><span class="t-ok">saludo.sh: ✓ sin problemas</span></div>
          <div><span class="t-prompt">herrero@forja</span> <span class="t-cmd">./saludo.sh</span></div>
          <div><span class="t-out">Hola, herrero</span></div>
          <div><span class="t-xp">🏆 +15 XP · Nivel 0 completado</span></div>
          <div><span class="t-prompt">herrero@forja</span> <span class="t-cmd">…</span><span class="term-caret"></span></div>
        </div>
      </div>
    </section>

    <section id="quickstart" class="quick">
      <h2>Listo en tres pasos</h2>
      <div class="steps">
        <div class="step"><b><span class="n">1</span> Clona la forja</b><code>git clone ${REPO_URL}.git\ncd bash-forge</code></div>
        <div class="step"><b><span class="n">2</span> Enciende la web + sandbox</b><code>docker compose up --build</code></div>
        <div class="step"><b><span class="n">3</span> Abre la terminal</b><code>http://localhost:8080</code></div>
      </div>
    </section>

    <section id="caracteristicas" class="features">
      <h2 class="sec-title">Lo que hay dentro</h2>
      <div class="feat-grid">${featuresHtml}
      </div>
    </section>

    <section id="mundos" class="mundos">
      <h2 class="sec-title">El camino: 9 mundos, un rango por conquista</h2>
      <nav class="worlds">${toc}</nav>
      ${sections}
      ${practiceSection}
    </section>

    <footer>
      <div class="wrap">
        <span>ᚲ <strong>Bash Forge</strong> · MIT · <a href="${REPO_URL}">${REPO_URL.replace("https://", "")}</a></span>
        <span>Catálogo generado del build real (<code>packages/lessons</code>): sin cifras inventadas.</span>
      </div>
    </footer>
  </div>
</main>
</body>
</html>`;

fs.writeFileSync(path.join(out, "index.html"), html);
// 404 para Pages
fs.copyFileSync(path.join(out, "index.html"), path.join(out, "404.html"));
console.log(
  `✔ docs-site/dist/index.html (${lessonList.length} lecciones · ${byLevel.size} mundos + ${byTrack.size} tracks de práctica, landing bash-arena-style + catálogo)`,
);
