# traps: reaccionar a señales

> **Objetivo:** Ejecutar código al salir, al recivr INT o al recevoir TERM.

## Teoría

`trap 'cmd' EXIT` lo ejecuta al finalizar el script; `trap 'cmd' INT` cuando llegue Ctrl+C.

## Tu reto

Crea `atrapa.sh` que registre un trap EXIT que imprima `limpieza al final`.

## Errores típicos

- [object Object]

---

*~12 min · Nivel 7 (Herrero de élite) · pulsa **Comprobar** cuando lo tengas.*
