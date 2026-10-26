# Arquitectura de Bash Forge

> Documento índice de la arquitectura. Cada decisión ambigua está registrada en
> `docs/DECISIONS.md`.

## 1. Visión general

Bash Forge es una plataforma web donde el alumno escribe scripts Bash en una terminal
real actuando sobre un Ubuntu 24.04 en contenedores. Los componentes:

| Componente | Tecnología | Función |
|---|---|---|
| `apps/web` | React + Vite + TS + Tailwind + Zustand + xterm.js | SPA, terminal, paneles de lecciones, i18n es/en, temas |
| `apps/sandbox-server` | Node 22 (TS) + `ws` + `node-pty` + `express` | Servidor de sesiones: PTY por sesión, usuarios efímeros, ejecutor de checks |
| `packages/shared` | TypeScript puro | Protocolo WS tipado, tipos de lección, contrato `LessonManifest` |
| `packages/lessons` | YAML + Markdown + Bash | Currículum: `lesson.yaml`, `lesson.md`, `setup.sh`, `check.sh`, `solution.sh`, `hints.md` |
| `docs-site` | React + Vite (SSG estático) | Documentación desplegada en GitHub Pages |
| `docker/` | Dockerfiles + nginx | Imágenes `web` y `sandbox` |

```
Navegador (React + xterm.js)
        │  HTTP + WebSocket
        ▼
[ web ]  nginx: sirve la SPA y hace proxy de /ws y /api
        │  red Docker interna "sandbox" (internal: true → sin Internet)
        ▼
[sandbox]  Ubuntu 24.04 + servidor Node (ws + node-pty + API de lecciones/validación)
        └─ un usuario Linux sin privilegios POR SESIÓN, con su home aislado
```

## 2. Flujo de una sesión

1. El navegador abre un WebSocket a `/ws` (proxy de nginx → `sandbox-server`).
2. El servidor valida conexión (límite de sesiones concurrentes + rate limit de mensajes).
3. Se asigna un usuario Linux pre-creado `forge_<NNN>` (0–499, creados en build time,
   ver D-07), con home en el volumen persistente `/home/forge_<NNN>`.
4. El servidor lanza una PTY por pestaña: `su - forge_<NNN>` → `bash -l` con `.bashrc`
   plantilla personalizada (prompt con código de salida, alias útiles, cd al workspace).
5. Los mensajes WS son JSON tipados (ver `packages/shared/src/protocol.ts`):
   `input`, `output`, `resize`, `ping/pong`, `session`, `exercise:check`,
   `exercise:result`, `error`, `term:new`, `term:close`.
6. Reconexión: el cliente reintenta con backoff exponencial; la sesión (usuario + home +
   sesiones de terminal) sobrevive a recargas del navegador. Un `session:attach` restaura
   las PTYs vivas y sigue el scroll hacia atrás de cada terminal.

## 3. Aislamiento (resumen; modelo completo en SECURITY.md)

- El contenedor sandbox **no monta** `/var/run/docker.sock` y está en una red `internal`
  (sin gateway ni salida a Internet).
- Rootfs de solo lectura: `tmpfs` para `/tmp` y volumen `forge_data` para `/home`.
- `cap_drop: [ALL]` + `cap_add` mínimas para cambiar de usuario (CHOWN, FOWNER, SETGID,
  SETUID, KILL, SETFCAP, DAC_OVERRIDE).
- `no-new-privileges`, `pids_limit`, `mem_limit`, `cpus`, ulimits (`nproc`, `fsize`,
  `cpu`) por sesión vía `prlimit` al arrancar la PTY.
- Límites por sesión en el servidor de sandbox: nº máx de sesiones concurrentes, nº máx
  de terminales por conexión, tasa de mensajes, tamaño máximo de payload WS por mensaje,
  TTL de inactividad y duración máxima de sesión.
- Validación de ejercicios (`check.sh`) ejecutada por el servidor como root leyendo el
  home del alumno, pero con los ficheros de check en `/opt/bashforge/checks` con
  permisos `0700` (el alumno no puede leer ni modificar los checks).
- Anti-fork-bomb: `pids_limit` del contenedor + `ulimit -u` por sesión + test automatizado.

## 4. Validación de ejercicios

1. El cliente envía `exercise:check` con `lessonId`.
2. El servidor localiza `check.sh` de la lección (montado como imagen, no como bind mount
   de código del repo: las lecciones van embebidas en la imagen `sandbox`).
3. Ejecuta, si existe, `setup.sh` (prepara el entorno del ejercicio) y después `check.sh`
   con `timeout` (30 s por fase); captura `stdout/stderr/exit`.
4. Compara con las aserciones declaradas en `lesson.yaml` (`validation.*`) y produce un
   informe estructurado: qué falló, qué se esperaba, qué se obtuvo, pista contextual.
5. Devuelve `exercise:result` al cliente; el cliente sincroniza XP/insignias con el
   `progressStore` (localStorage + volumen).

Los checks son **caja negra**: ejecutan `solution.sh` de referencia y el script del
alumno con las mismas entradas generadas y comparan comportamiento (salida, código de
salida, efectos en ficheros), no texto literal. `check.sh` de ejemplo:

```bash
#!/usr/bin/env bash
set -euo pipefail
# $1 = cifrado de sesión (directorio del alumno), el resto: argumentos del test
```

Anti-trampa: el runner genera entradas pseudoaleatorias por lección (`inputs/`,
deterministas por semilla) y compara la salida del alumno contra la de `solution.sh` +
aserciones explícitas. Un `echo` fijo no pasa cuando la entrada varía.

## 5. Datos y persistencia

- **Volumen Docker `forge_data`** (`/home`): homes de sesión y estado de progreso global
  (`/home/.progress/<forgeId>.json`). Configurable con `FORGE_DATA_VOLUME` en `.env`.
- **localStorage del navegador**: espejo del progreso para UI instantánea y fallback tras
  `purge`.
- **Backup/restore**: `bashforge backup` hace tarball del volumen; `restore` lo recupera.

## 6. Notas de implementación

- Monorepo por workspaces npm con TypeScript estricto (`strict: true`, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes` en los paquetes de código).
- `apps/web` y `docs-site` comparten paleta y tokens de diseño mediante el paquete
  `packages/shared`.
- Los checks de CI: lint (shellcheck/hadolint/eslint/prettier), unitarios (vitest),
  e2e (Playwright), imagen Docker + trivy, despliegue de Pages y tests de lecciones
  (cada `solution.sh` debe pasar su propio check y el estado inicial debe fallarlo).
