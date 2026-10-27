# Contribuir a Bash Forge

## Qué hay
- `packages/lessons` — fuente del currículum (YAML por nivel) + generador.
- `apps/sandbox-server` — WS con terminales reales (node-pty), pool de usuarios y validador.
- `apps/web` — SPA React + xterm.js.
- `docker/` — imágenes y compose del stack.
- `docs-site/` — catálogo estático para GitHub Pages.

## Cambiar lecciones
1. Edita el YAML del nivel (`packages/lessons/levels/levelN.yaml`): escríbelo con scalars
   entrecomillados o bloque `|`; sin backticks sueltos que rompan YAML.
2. `make lessons` para regenerar `lessons/` + `manifest.json`.
3. `node tools/lint-lessons.mjs` debe seguir en verde (0 problemas).

## Añadir niveles
Los IDs de usuario reservados conviven con `useradd` en `docker/sandbox.Dockerfile`;
otro nivel no requiere cambios de infraestructura salvo que cambie el formato.

## Probar el stack completo
```bash
make check         # typecheck + build
make test          # vitest
docker compose -f docker/docker-compose.yml up --build
# → http://localhost:8080
```

## Convenciones
- Commits en español, tipo convencional: `feat(lessons): ...`, `fix(checker): ...`.
- Todo lo que toque el protocolo pasa por `packages/shared`.
- Los scripts shell pasan shellcheck verde.
