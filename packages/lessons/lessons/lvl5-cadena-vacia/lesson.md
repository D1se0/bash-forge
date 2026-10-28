# Detectar si una cadena está vacía

> **Objetivo:** Controlar que lleguemos a hacer algo con lo que NO llegó.

## Teoría

`[ -z "$v" ]` es TRUE si $v está vacío o sin setear; `[ -n "$v" ]` es TRUE si tiene al menos un carácter.

## Tu reto

Crea `vacio.sh` que reciba $1 y:
- "`vacío: imprime vacío y exit 1.`"
- "`no vacío: imprime ok y exit 0.`"

## Errores típicos

- Comprobar [ $v ] pensado que vale 0 como vacío: NO, que es length>0. Usa -z/-n.

---

*~7 min · Nivel 5 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
