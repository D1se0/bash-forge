# set -euo pipefail: el modo estricto

> **Objetivo:** Escribir scripts que PAREM en todo error en lugar de seguir ciegamente.

## Teoría

`set -e`: parar al primer error. `set -u`: error si usas una var no seteada. `set -o pipefail`: la tubería falla si CUALQUIER comando falla.

## Tu reto

Crea `estricto.sh` que arranque con set -euo pipefail, declare `x=1`, imprima `ok: $x` y luego intente leer `$NOEXISTO` dentro de un if que la compruebe, sin romperse.

## Errores típicos

- [object Object]

---

*~10 min · Nivel 8 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
