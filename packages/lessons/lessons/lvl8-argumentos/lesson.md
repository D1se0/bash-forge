# Argument parsing robusto con while y case

> **Objetivo:** Aceptar banderas con y sin argumentos, y rutas con espacios.

## Teoría

`while (($#)); do case $1 ...; shift; done` te permite procesar un stream de banderas sin confundir orden.

## Tu reto

Crea `cli.sh` con:
- "`-n nombre: imprime Hola nombre.`"
- "`--upper: lo imprime en mayúsculas.`"
- "sin args: Uso y exit 1."

## Errores típicos

- Olvidar shift después de procesar cada bandera, si no se cuela la misma nunca-quitando-shif.

---

*~12 min · Nivel 8 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
