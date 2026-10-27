# Decisiones (`docs/DECISIONS.md`)

Formato: contexto → decisión → alternativas descartadas. Una fila por decisión no trivial.

| # | Contexto | Decisión | Descartadas |
|---|---|---|---|
| D1 | Auditoría 4/10 identidad visual; tokens sueltos en `styles.css` | **Reescribir** la capa visual como workspace `packages/ui` con tokens CSS + Tailwind preset; la app consume Julio. Se conserva la estructura de 3 paneles que ya funciona | Rehacer todo `apps/web` de cero; parchear `styles.css` (no arrivaria a runas/temas) |
| D2 | e2e vacía, único script CDP ad-hoc | Introducir **Playwright** como suite oficial (funcional + visual + ofensiva); el CDP script se conserva como smoke rápido documentado | qawolf/ Puppeteer directo |
| D3 | Lecciones sólidas (8/10) con validadores OK | **Conservar** contenido y checks; migrar metadatos (`world`, `rune`, textos EN) con linter extendido — sin reescribir teoría válida | Reescribir desde cero (perdería 82 lecciones verificadas) |
| D4 | docs-site plano sin base | Reescribir en React+Vite SSG con `base: '/bash-forge/'` y build en CI reusando tokens de `packages/ui` | Jekyll/A really (rompe identidad React compartida) |
| D5 |(Funciones de contraste) | Script propio `scripts/contrast-check.ts` en CI en vez de plugin Tailwind | axe runtime únicamente (no tapa par texto/fondo adyacente) |
| D6 | Compatibilidad de datos | `ProgressSnapshot` gana campo `v`; migración v1→v2 con tests;(OpCodes localStorage «gana el más reciente», XP nunca baja) | drop de datos antiguos (violates 0.3) |
| D7 | Deploy key no puede tocar settings del repo | `docs/GITHUB_SETUP.md` con instrucciones para el dueño (social preview, topics, descripción) | fingir capas no existentes |
| D8 | Sin Playwright en nodo del sandbox ni dependencias del campus | e2e corre en el **host** con Playwright + Chromium (ya instalado chromium), no dentro del contenedor | Playwright dentro de la imagen sandbox (blows size 10×) |
| D9 | Fullscreen no puede validarse 100 % en headless | Documentar la limitación; pruebas CDP-playwright para el modo «foco» CSS y verificación del fullscreen DOM API con emulación | declarar «probado» sin evidencia (ley 8) |
| D10 | Plan de impacto (AUDIT §6) | Orden: F1 design system → F2 app nórdica → F3 docs-site → F4 escaparate → F5 seguridad/CLI → F6 editor/nano/depurador | Empezar por lecciones o seguridad (el propietario pide lo visual primero) |
