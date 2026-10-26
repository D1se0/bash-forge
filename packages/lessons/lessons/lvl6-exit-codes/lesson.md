# exit codes, && y ||

> **Objetivo:** Encadenar comandos por éxito/fallo.

## Teoría

`a && b`: b SOLO si a salió bien (0). `a || b`: b SOLO si a falló. Cada combinación respete cuando pasa el control.

## Tu reto

Crea `cadena.sh` que reciba $1:
- "si $1 vale ok: imprime bien y exit 0."
- "si $1 NO vale ok: imprime mal y exit 3."

## Errores típicos

- [object Object]

---

*~9 min · Nivel 6 (Herrero de élite) · pulsa **Comprobar** cuando lo tengas.*
