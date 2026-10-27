# Índice de evidencias

| Fase | Qué | Comando | Resultado | Evidencia |
|---|---|---|---|---|
| 00 | Backup completo | `git tag pre-overhaul` + tar.gz ×2 + volumen docker_sandbox-data | OK (`/home/kali/backups/`, 5 ficheros) | hashes en el log del shell |
| 00 | Limpieza entorno | kill node 8020 + `compose down -v` bf-fresh + rm temporales | puertos 8020/8019/8079 libres; solo stack 8080/8010 | `ss -ltnp` |
| 00 | Línea base app escritorio | `chromium --headless --screenshot` 1440×900 | captura + revisión 4.3 | `00-baseline/app__1440x900__nord-dark__es.png` |
| 00 | Línea base app móvil | idem 390×844 | captura con overflow documentado | `00-baseline/app__390x844__nord-dark__es.png` |
| 00 | Línea base docs-site | servidor estático :8877 + chromium 1440×900 y 390×844 | capturas de la web plana actual | `00-baseline/docs-site__*.png` |
| 02 | Sistema de diseño nórdico | build web + docker compose up web | `/styleguide` renderiza sin errores de consola | `02-design-system/styleguide__1440x900__{dark,light}__es.png` |
| 02 | Styleguide móvil | Playwright 390×844 DSC2 fullpage | paleta/tipos/runas/logo sin overflow | `02-design-system/styleguide__390x844__{dark,light}__es.png` |
| 02 | Regresión app con tokens | Playwright 1440×900 y 390×844 | 0 pageerror / 0 console.error | `02-design-system/app__*` |
| 02 | Contraste AA | `scripts/contrast-check.mjs` | ✔ AA completo en ambos temas | stdout de `scripts/lint.sh` |
| 02 | Lint completo | `./scripts/lint.sh` | verde: contrast + typecheck ×3 | log del shell |
| 02 | Tests unitarios | `npm test --workspaces` | 9 passed, 1 skipped | log del shell |
| 02 | E2E fullscreen | `node apps/web/scripts/e2e-fullscreen.mjs` | ✔ E2E completo en verde | log del shell |
| 02 | Fix runtime JSX | `React is not defined` → createElement explícito en packages/ui | styleguide recapturada sin errores | commits + capturas 02 |
| 03 | styles.css 100% tokens | reescritura: 0 colores literales, solo var(--token) | lint verde (typecheck ×3) | `03-app-nordic/app__*.png` |
| 03 | Toggle dark/light | botón en topbar + localStorage + prefers-color-scheme (initTheme antes del render, sin FOUC) | 0 pageerror / 0 console.error | capturas light + dark revisadas |
| 03 | Tema claro «Día de Nieve» | captura 1440×900 light | contrast AA (light tokens en tokens.css) | `03-app-nordic/app__1440x900__light__es.png` |
| 03 | Fix headless colorScheme | chromium headless por defecto es light → captura dark con colorScheme:'dark' | capturas dark correctas | matiz documentado en INDEX |
| 04 | docs-site nórdico | `node scripts/build.mjs` + `serve-check.mjs` bajo `/bash-forge/` | 200 en html/css + woff2; fuentes cargadas verify con `document.fonts.load()` | `04-docs-site/docs-site__{1440x900,390x844}__dark__es.png` |
| 04 | Fix font-face relativo | `url('/fonts/…')` absoluto → `url('fonts/…')` relativo (Pages base) | status:loaded ×3, 0 errores de consola | log del shell |
| 05 | Escaparate README | `node scripts/render-readme.mjs` + render en chromium real | banner según tema (picture/dark), 0 imágenes rotas, móvil OK | `05-escaparate/readme__*.png` |
| 05 | Banner SVG nórdico | `docs/assets/banner-{dark,light}.svg` (aurora + yunque + kenaz, sin fuentes personalizadas) | revisado visualmente claro/oscuro | `05-escaparate/*.png` |
| 05 | WebP optimizados | `convert` PNG→WebP de evidencias reales (29–68 KB) | capturas reales de las fases 02–04 | `docs/assets/*.webp` |
| 06 | Sandbox con nano 7.2 | `docker compose build sandbox` + verificación en contenedor | nano 7.2 + shellcheck 0.9.0 + include /etc/nanorc sin errores (0 “Mistakes”) | log del shell |
| 06 | Referencia bash-arena | Playwright sobre d1se0.github.io/bash-arena (top/bottom) | navbar + hero + terminal demo + cards + footer | `06-redesign/ref-bash-arena__*.png` |
| 06 | Nano con sintaxis coloreada | `node scripts/capture-nano.mjs` en la terminal real de la app | shebang/cadenas/vide.ends/keywords coloreados con nanorc de la forja | `06-redesign/nano-colores__1440x900__dark__es.png` |
| 06 | forge-lint (linter del editor) | `docker/forge-lint.sh` instalado en sandbox + recaptura en app | shellcheck coloreado por línea, resumen y exit ≠ 0 con avisos | `06-redesign/app__forge-lint__*.png` |
| 06 | Sidebar «por dónde empiezo» | redesign panels.tsx: next-card + numeración + progreso/nivel | next-card=1, 82 dots, 9 grupos, XP-bar | `06-redesign/app__sidebar__1440x900__dark.png` |
| 06 | Fullscreen con salida | e2e `scripts/capture-app-e2e.mjs`: ESC y botón focusbar | fullterm on→off por ESC y por botón, focusbar accesible | `06-redesign/app__fullterm-{on,off}__*.png` |
| 06 | docs-site landing | build + `capture-docssite.mjs` bajo `/bash-forge/` | 200 html/css/woff2 ×6 + fuentes loaded ×3 | `06-redesign/docs-site__*.png` |
| 06 | docs-site sin cifras inventadas | minutes ausentes en manifest → «~0 min» ocultados | hero y taglines sin datos falsos | `docs-site/scripts/build.mjs` (stats) |
