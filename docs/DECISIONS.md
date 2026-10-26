# Decisiones de diseño (ADR ligero)

Registro de decisiones tomadas cuando el enunciado dejaba margen. Formato: contexto →
decisión → por qué.

## D-01 — Usuarios de sesión pre-creados en la imagen (forge_000 … forge_499)

**Contexto.** El rootfs del sandbox es de solo lectura y añadir usuarios al vuelo exigiría
escribir en `/etc/passwd`. **Decisión.** Crear 500 usuarios `forge_NNN` (uid `2NNN`,
capa `kali? no`, `bash` shell, home `/home/forge_NNN` sobre el volumen) en el build de la
imagen; en runtime solo se asigna uno libre. **Why.** Es compatible con `read_only: true`
(sin escrituras en `/etc/passwd`) y elimina una ventana de creación de usuarios en el
camino caliente. Límite: 500 sesiones-alumno históricas; al agotarse el pool se limpian
los homes huérfanos y se reutilizan los inactivos (TTL).

## D-02 — Cambio de usuario con `su -` dentro de una PTY única

**Contexto.** `node-pty` no soporta `uid` al hacer spawn. **Decisión.** Cada terminal se
lanza como `su - forge_NNN` (root → usuario) mediante `node-pty` + `prlimit` en el
proceso padre para ulimits por sesión. **Why.** Es la vía más simple, robusta y sin
afecciones de kernel (sin `-u` hacks ni SUID bins propietarios).

## D-03 — Validación de ejercicios ejecutada por el proceso del sandbox (root), con los
checks en `/opt/bashforge/checks` (`0700`)

**Contexto.** El alumno no debe leer los checks. **Decisión.** Los ficheros de check viven
en el sandbox con permisos `root:rwx,otros:---`; el runner los lanza con `cwd` = home del
alumno. **Why.** Root ya ejecuta el servidor; añadir un usuario sudo añade superficie de
ataque sin beneficio (el check solo se dispara a petición del cliente vía WS firmado por
el lado servidor — no se acepta `check.sh` arbitrario del cliente).

## D-04 — Progreso del alumno en el volumen, federado por `forgeId` de navegador

**Contexto.** Recargar la página debe conservar progreso. **Decisión.** Un `forgeId`
UUID persiste en `localStorage`; el progreso (XP, lecciones superadas, insignias) se
guarda en `/home/.progress/<forgeId>.json` vía WS (`progress:save` / `progress:load`)
además de en localStorage. **Why.** Sobrevive a recargas, a `down`/`up` y a cambios de
sesión de terminal, sin base de datos.

## D-05 — Currículum como paquete, no como base de datos

**Decisión.** Las lecciones viven en `packages/lessons` (markdown + yaml + bash) y se
instalan dentro de la imagen `sandbox` (`COPY packages/lessons bashforge`), expuestas vía
`GET /api/lessons` y `GET /api/lessons/:id`. **Why.** La web de docs puede leer el mismo
manifest JSON vía CI; los checks viajan con la imagen; añadir lecciones comunitarias es
solo otra carpeta (`community-lessons/`), sin recompilar código.

## D-06 — Tema visual de terminal: 7 présats + selector en vivo

Cada tema (Dracula, Tokyo Night, Catppuccin, Solarized, Gruvbox, Matrix, Amber CRT) es
una paleta ANSI para xterm.js. La conmutación es cliente y solo cambia la capa visual:
el sandbox no lo nota.

## D-07 — Red `internal: true` para `web` y `sandbox` + red de publicación aparte

**Contexto.** Solo `web` publica puerto (comportamiento en `.env`). **Decisión.** Dos
redes: `edge` (solo `web` conectada al backend publicado) y `sandbox` (internal: web +
sandbox, sin salida a Internet). **Why.** La capa del sandbox no puede llamar a casa, ni
escanear otros servicios del host.

## D-08 — Vite base para Pages

`docs-site` usa `base: '/bash-forge/'` dado el URL final `https://d1se0.github.io/bash-forge/`
(sitio de proyecto, no de usuario).

## D-09 — Métricas de sesión: latencia y estado de conexión en la barra superior

El WS manda `ping`/`pong` cada 10 s; el cliente muestra la latencia redondeada. El estado
(`conectado`, `reconectando…`, `offline`) se pinta en el chip del header con color
semántico.

## D-10 — Limpieza de sesión: TTL → reutilización de pool de usuarios

Al arrancar y cada 60 s el sandbox-server recorre `/home/forge_*` buscando usuarios sin
PTY viva activa hace más de `SESSION_TTL_MIN` (default 60) y los marca disponibles; los
homes de usuarios sin conexión hace `SESSION_PURGE_DAYS` (default 3) se policían
(`rm -rf` del home, reset a plantilla). Los ficheros de la plantilla `.bashrc` viven en
`/etc/skel.bashforge`.

## D-11 — Trivy + hadolint en CI, no en runtime

El scan de vulnerabilidades se hace en CI (falla si un `CRITICAL` sin fix aparece). En
runtime no se ejecutan escáneres para no penalizar la interactividad.

## D-12 — Español por defecto

La UI i18n carga español como idioma base (`es`) e inglés como alternativa. La detección
por navegador solo se aplica si el usuario aún no ha elegido idioma.
