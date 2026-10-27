# packages/lessons

Fuente del currículum de Bash Forge y su generador.

- `levels/levelN.yaml` — especificaciones pedagógicas por nivel (0–8).
- `generator.mjs` — compone `lessons/<id>/{lesson.yaml,lesson.md,hints.md,solution.sh,setup.sh?}` + `manifest.json`.
- `tools/lint-lessons.mjs` — valida estructura; `make -C packages/lessons lint`.
- `lessons/` y `manifest.json` — SALIDA generada; no se edita a mano.

## Flujo
```bash
make lessons    # = generate + lint
```
Al añadir/retocar lecciones: edita el YAML del nivel, regenera, y corre el linter.
Cuidado con YAML: valores con `:` interior o backticks van entrecomillados (`"..."`).
`node -e "require('yaml').parse(...)"` es la forma rápida de localizar el error.
