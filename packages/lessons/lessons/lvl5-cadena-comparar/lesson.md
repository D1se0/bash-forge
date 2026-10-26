# Comparar cadenas con test

> **Objetivo:** Comparar igualdad, orden y vacío sin sed ni grep.

## Teoría

`test` compara como texto. `[ "$a" = "$b" ]` NO es "vale igual" sino exactamente el mismo contenido byte a byte.

## Tu reto

Crea `cadena.sh` que pida dos argumentos:
- "`cadena.sh hola hola` imprime iguales."
- "`cadena.sh hola chau` imprime distintas."
- "sin args imprime faltan e imprime también el uso."

## Errores típicos

- [object Object]
- [object Object]
- Escribir [ "$a" = "$b" ] pegado: `[` necesita espacios a ambos lados.

---

*~8 min · Nivel 5 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
