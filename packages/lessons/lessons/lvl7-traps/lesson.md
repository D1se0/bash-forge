# traps: reaccionar a señales

> **Objetivo:** Ejecutar código al salir, al recivr INT o al recevoir TERM.

## Teoría

`trap 'cmd' EXIT` lo ejecuta al finalizar el script; `trap 'cmd' INT` cuando llegue Ctrl+C.

## Tu reto

Crea `atrapa.sh` que registre un trap EXIT que imprima `limpieza al final`.

## Errores típicos

- Pon todas las Señales con el mismo trap y ver como el Ctrl+C se queda colado: usa si es necesario SEÑAL por SEÑAL.

---

*~12 min · Nivel 7 (Herrero de élite) · pulsa **Comprobar** cuando lo tengas.*
