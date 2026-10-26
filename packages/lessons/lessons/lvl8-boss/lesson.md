# Boss Fight · El Constructor de Herramientas

> **Objetivo:** Examen final: escribe una mini-herramienta CLI profesional.

## Teoría

Todo junto: set -euo pipefail, trap, while/case sobre args, funciones, exit codes convencionales. Lo que ves aquí es la estructura de scripts contemporáneos.

## Tu reto

Crea `herramienta.sh` con:
- "set -euo pipefail al arranque."
- "usage() instructiva implícita; función `saludar <nombre>` que imprime ¡Hola, <nombre>!."
- "Main que -n nombre procese, -h muestre usage, y sin args: usage, exit 1."
- "trap EXIT que imprima adios."

## Errores típicos

- No declarar el caso de NO args antes que el de banderas.

---

*~20 min · Nivel 8 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
