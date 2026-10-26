# Boss Fight · El Arquitecto de la Fragua

> **Objetivo:** Examen de estructuras: funciones + getopts + usage + exit codes.

## Teoría

Un boss de arquitectura definitiva. Para pasar, necesitas: usage(), getopts, funciones y exit codes convencionales (0 ok, 1 error).

## Tu reto

Crea `fragua.sh` con:
- "`usage()` instructiva (`Uso: fragua.sh -n nombre`)."
- "`-n nombre` → imprime `forjando para nombre`."
- "sin args → usage y exit 1; con `-h` → usage y exit 0."
- "funci\u00f3n `forjar(nombre)` llamando desde main."

## Errores típicos

- Usage con exit 0 cuando pidieron -h y exit 1 cuando no llega nada.
- Olvidar shift $((OPTIND-1)) si doesn't confuse las opciones con posicionesales.

---

*~15 min · Nivel 4 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
