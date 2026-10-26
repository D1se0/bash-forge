# Comillas dobles, simples y escapes

> **Objetivo:** Controlar exactamente qué expande Bash y qué no.

## Teoría

`'literal'` no expande NADA, `$var` dentro sí expande. `\"` saca una comilla dentro de dobles. Reglas no negociables si vas a citar defesa.

## Tu reto

Ejecuta `archivo.sh` que con $1 imprima lo que lo que le llegó QUOTEADO manualmente (sin eval): siempre `'valor: X'`.

## Errores típicos

- [object Object]

---

*~10 min · Nivel 7 (Herrero de élite) · pulsa **Comprobar** cuando lo tengas.*
