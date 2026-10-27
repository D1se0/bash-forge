# Auditoría Bash Forge — Fase 0 (pre-overhaul)

Fecha: 2026-10-27 · Rama base: `main @ f795898` · Red de seguridad: tag `pre-overhaul`, rama `feat/nordic-overhaul`,
backup completo en `/home/kali/backups/` (código sin `.git`, código+`.git`, y volumen `docker_sandbox-data` de homes/progreso).

## 1. Inventario

| Área | Líneas | Estado |
|---|---|---|
| apps/web/src | 1 132 | React + xterm, esbuild (sin Vite, sin Tailwind, sin i18n) |
| apps/sandbox-server/src | 1 308 | ws + node-pty + checker declarativo |
| packages/shared/src | 519 | tipos del protocolo + progreso (sin Zod) |
| packages/lessons | 531 + 82 lecciones generadas | 70 lessons · 7 challenges · 5 bosses |
| docs-site | 81 (HTML estático plano) | sin React, sin base `/bash-forge/` |
| e2e/ | 0 | sin Playwright |
| docker | 46 | 2 imágenes + compose básico |
| Tests | 9 (vitest) | checker + store + typeguards |

## 2. Ejecución real (logs de la sesión)

- `npm ci` en clon fresco: **OK** (tras fix aa96c49 del lockfile).
- `lint.sh` (shellcheck + linter de lecciones + 3 typechecks): **verde**.
- `npm test --workspaces`: **9 tests en verde** (2 archivos).
- `docker compose up`: sandbox **healthy**, 82 lecciones en `/api/lessons`.
- E2E CDP en clon fresco: catálogo 82, fullscreen + ESC, navegación — **OK**.
- Flujo de alumno (WS): PTY real, `exercise:check` pass/fail con feedback — **OK**.

## 3. Línea base visual (`docs/evidence/00-baseline/`)

Revisadas con checklist 4.3 sobre `app__1440x900`, `app__390x844`, `docs-site__1440x900`:

- **App escritorio (5/10):** estructura correcta y legible, catálogo y panel en orden. Pero: tipografía del sistema (sin JetBrains Mono cargada ni runas reales), tarjetas genéricas sin identidad, topbar con botones sueltos desalineados, terminal vacía con mucho aire muerto, brasa ausente (0 momentos épicos), XP card vacía y ancha, jerarquía de 3 paneles plana (mismo gris en sidebar y panel).
- **App móvil (3/10):** topbar rota (botón «P...» cortado, overflow horizontal), objective desbordado (`...echo|` cortado), sticky de acciones tapa el contenido, panel de lección aplastado bajo la terminal, toques <44px.
- **docs-site (6/10):** funciona y es honesto (82 lecciones reales), pero es una lista plana sin identidad: sin hero, sin runas, sin logo/anvil, sin base `/bash-forge/`, colores por defecto (#0b0f19 con azul link), 0 SEO/OG, en L1 repetido el rank «Aprendiz de la fragua».

## 4. Puntuaciones 0–10 y decisiones

| Área | Nota | Severidad capital | Decisión |
|---|---|---|---|
| Identidad visual | 4 | alta | **Reescribir** (sistema de diseño nórdico `packages/ui`) |
| UX app | 5 | alta | **Refactorizar** (paneles/movimiento; conservar estructura) |
| Móvil | 3 | alta | **Reescribir** responsive (pestañas inferiores 7.8) |
| Terminal | 7 | baja | **Conservar** (xterm+PTY sólido; añadir temas/estado reconexión) |
| Editor (nano/diagnósticos) | 3 | media | **Reescribir** capa A (nanorc) — F7.12 |
| Lecciones | 8 | baja | **Conservar** (82 validadas; migrar metadatos: mundos/runas/EN) |
| Validación/checks | 7 | media | **Conservar + extender** (anti-cheat, ShellCheck, goldens) |
| Seguridad | 5 | alta | **Refactorizar** (cap_drop, internal, límites + suite ofensiva) |
| CLI bashforge | 6 | media | **Refactorizar** (comandos doctor/backup/diagnóstico) |
| docs-site | 4 | alta | **Reescribir** (React+Vite base `/bash-forge/`, Nórdico) |
| README/escaparate | 4 | alta | **Reescribir** (banner SVG, badges, GIF) |
| CI | 6 | media | **Extender** (visual, docker, release; SHA pinning) |
| Tests | 5 | media | **Extender** (Playwright, lecciones CI, visual) |
| Accesibilidad | 3 | alta | **Reescribir** (AA: foco, aria-live, contraste legal) |
| Rendimiento | 6 | baja | **Pulir** (fuentes autoalojadas, 60fps aurora) |

## 5. Hallazgos puntuales (con evidencia)

1. **[alta] Overflow móvil:** topbar y objective cortados (`app__390x844`); grid `1fr` apila terminal sobre pergamino sin pestañas decidas.
2. **[alta] Docs-site sin base:** build no usa `/bash-forge/` (prompt maestro 12) — en Pages con subruta rompería assets relativos… **aún no lo rompe** porque es un único index sin assets, es decir: suerte, no diseño.
3. **[alta] Sin fuentes ni iconografía:** `--sans` es system-ui; la runa NO existe — el prompt del sandbox sin runas; logo es emoji ⛏+🔥.
4. **[media] `e2e/` vacía:** la única verificación DOM es un script CDP ad-hoc (`apps/web/scripts/e2e-fullscreen.mjs`), no suite.
5. **[media] Sin i18n:** todo ES hardcodeado; `lang: 'es'` en ProgressSnapshot sin uso.
6. **[media] Workspace `@bashforge/ui` inexistente** — tokens viven sueltos en `styles.css`.
7. **[baja] L1 rank repetido en docs-site** (`ranks[lvl]` array de 9 con duplicados).

## 6. Plan ordenado por impacto

1. **F1** Sistema de diseño nórdico (`packages/ui`): tokens exactos del prompt (abyss/base/ice/ember), runas SVG, logo yunque+ᚲ, fuentes autoalojadas (Inter Tight/Fraunces/JetBrains Mono woff2 subset), tema claro+oscuro, `/styleguide`.
2. **F2** App con la identidad: rebuild UI sobre el WS existente (layout 7.1, runas en sidebar, brasa en Comprobar, momentos chispa), móvil 7.8, hover/reduced-motion.
3. **F3** docs-site React con base `/bash-forge/` + hero aurora + galería real + CI Pages.
4. **F4** Escaparate GitHub: banner SVG con `<picture>`, badges, mermaid, social-preview.
5. **F5** Seguridadsuite + CLI doctor + lessons CI goldens.
6. **F6+** Editor nano, depurador visual, Playwright matriz completa.
