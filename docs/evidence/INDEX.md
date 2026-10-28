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
| 07 | Niveles bloqueados | guard en selectLesson + botones disabled de niveles superiores | locked-lessons=73, locked-level-chips=8, desbloqueo al completar cada nivel | `07-unlocks/app__sidebar__*.png` |
| 07 | Orden pedagógico | lecciones → retos → Boss dentro de cada nivel | boss-primero=false en E2E | log de `scripts/capture-app-e2e.mjs` |
| 07 | Validación por salida | bloque «Cómo se valida: por la SALIDA» con las aserciones de stdout | expected-outputs=1 en la lección del shebang | `07-unlocks/app__salida-esperada__*.png` |
| 07 | Cheatsheet de Bash | popup glass con búsqueda: 112 entradas en 13 secciones (cheatsheet.ts) | abre/filtra/cierra (Esc y ✕) en E2E | `07-unlocks/app__cheatsheet__*.png` |
| 07 | Botón Ampliar retirado | solo queda «Pantalla completa» en la topbar | sin .term-actions en DOM | E2E + captura |
| 07 | Animaciones docs-site | fade-up hero + tipeo secuencial con caret + reveal on scroll (view timeline, progressive) | capturas + 0 errores de consola | `06-redesign/docs-site__*.png` |
| 07 | Limpieza Docker | rmi de dangling + imágenes viejas (bf-fresh/bachforge-fresh/*:test) + builder prune | imágenes 2.54GB→0.83GB, build cache 5.26GB→0 (~7GB liberados) | `docker system df` antes/después |
| 08 | Lateral plegable | botón «Plegar lateral» en topbar + pestaña «◀ Forja» flotante + persistencia en localStorage | sidebar-plegada=1, sidebar-oculta=true, re-despliegue por pestaña OK | `06-redesign/app__sidebar-plegada__*.png` |
| 08 | Workspace por nivel | la terminal cd-ifica a `$HOME/forja/nivel-N` al abrir una lección; el checker/setup/seeds ejecutan en ese mismo dir (checker.ts) | auto-cd=true (pwd muestra forja/nivel-0) + verificación manual `su` en el sandbox | log E2E + captura `app__sidebar-plegada` |
| 08 | Recordar la sesión | `bf.currentLesson` + `bf.openLevels` en localStorage: al recargar, retoma la lección y la sección | restauración verificada en restauración de página | `apps/web/src/App.tsx` (catalog effect) |
| 08 | Progreso portable | «Exportar» descarga JSON con snapshot; «Importar» valida y aplica, conservando el forgeId local | progress-io=2, descarga real `bashforge-progreso-forge_*.json` en E2E | log E2E |
| 08 | Cheatsheet: operadores de test | sección nueva «Operadores de test ([ ] y [[ ]])» con -f/-d/-s/-r/-w/-x/-b/-c/-p/-S/-L/-O/-G/-N/-k/-t/-nt/-ef/=~/-z/-n/-a | 135 entradas en 14 secciones | `app__cheatsheet__*.png` |
| 09 | Tools del currículum en el sandbox | man/man-db regenerado (mandb), fix de exclusión /usr/share/man (node:22-slim), herramientas apt en sandbox.Dockerfile | sonda `command not found` = 0 en las 82 lecciones | `docker/sandbox.Dockerfile` + log de sonda |
| 09 | Sonda de lecciones completa | `/tmp/probe-lessons.cjs` emulando al alumno (solución pegada/executable) vía runCheck real | 45 verificables en verde · 37 de autor (sin solución) · 0 fallos | log del shell (sonda v5) |
| 09 | Fixes de lecciones imposibles | level0 `$PWD/workspace`, level1 regex JS `read -s`, level2 checks autocontenidos (.fx), level3 select (4) salir + tomaste tijera + expectExit, level3 cstyle 0..4, level4 versión/exit 1 | sonda verde completa | `packages/lessons/levels/level{0..4}.yaml` |
| 09 | select por stderr | checker: expectOutput también mira stderr (el menú de select va por stderr) | lvl3-select verde; tests vitest 4 passed | `apps/sandbox-server/src/checker.ts` |
| 09 | Popup glass de progreso | ProgressPopup portal al body: KPIs + niveles + Exportar/Importar JSON + PDF; cheques de formato en export e import | kpi=4 niveles=9, descarga JSON válida, import aplicado (sidebar 60 XP) | `/tmp/popup-glass2.png` (evidencia shell) |
| 09 | PDF profesional | ventana de impresión A4 con logo, KPIs, barras por nivel e insignias | secciones OK, BASH FORGE renderizado | `/tmp/pdf-preview2.png` (evidencia shell) |
| 09 | status + purga | `./bin/bashforge status` y `purga` nuevos (compose ps + salud HTTP + conteo de lecciones; down -v --rmi local) | status OK tras purga+dev: sandbox healthy 82 lecciones + web OK | log del shell |
| 10 | CLI robusto + ciclo verificado | `bashforge` reescrito (shellcheck OK): status/list tabulados, verify con 404 humano, dev espera salud, üsaje claro | ciclo purga → dev → status → list → verify en verde; purga cancelada no borra nada | log del shell |
| 10 | Purga con export de seguridad | `/api/progress` + `/api/progress/:forgeId` y respaldo automático en `backups/` ANTES de borrar volúmenes + confirmación | backup `bashforge-progreso-forge_demo.json` generado en `backups/progreso-*/` y borrado después intacto | `apps/sandbox-server/src/http.ts` + log |
| 10 | Nivel 9: bucles | level9.yaml (for reforzado, while acumulador, until, case en bucle, anidados break 2, while shift, reto y boss) + LESSON_LEVELS/ unlocking a 9 | sonda: 8/8 lecciones en verde (22 tareas) con solución | log del shell + `packages/lessons/levels/level9.yaml`
| 10 | Web y lint al día | recuento de niveles 9→10 en tests, lint-lessons admite 9, E2E del popup actualizado (progreso-export real) | lint E2E y typecheck ×3 en verde; 90 lecciones generadas | log de `scripts/lint.sh` + E2E |
| 11 | Modo avanzado «Desbloquear todo» | botón en el sidebar (bf.unlockAll en localStorage): ignora los candados progresivos, ignorado en el guard de App; «Volver a bloquear» re-sella SOLO los niveles que el progreso tenía bloqueados | E2E: locked 81→0, Boss L9 abre sin flash, re-lock 81=81; captura del modo on | `10-unlocks/app__unlock-all__*.png` + log E2E |
| 12 | Práctica dirigida (IF/FOR/WHILE/CASE) | 12 lecciones nuevas con `track` (3 por tema) en `practice.yaml`, fuera del camino L0→L9: sección «Práctica dirigida» en el lateral sin candados, workdir propio `forja/practica/<tema>` (web + checker), XP propio; manifest sin contaminar (counts.practice) | banco local: 12/12 lecciones, 30/30 tareas ok; E2E: 4 tracks sin candados, pwd `forja/practica/if`, check en verde y +12 XP | `06-redesign/app__practica-*.png` + log del banco y E2E |
| 12 | Fix [object Object] | generador rescata ítems de errors:/hints: parseados como Mapa por YAML («clave: resto») — tocaba a 76 ficheros del camino | grep [object Object]: 0; lint-lessons 102 lecciones, 0 problemas | grep + log generator |
