# elif, else y orden de evaluación

> **Objetivo:** Encadenar varias condiciones y pensar el orden.

## Teoría

Solo se dedica a la primera condición que sale TRUE; nunca hacia abajo si ya entró por arriba. El orden importa.

## Tu reto

Crea `escalera.sh <edad>`:
- "menos de 13: niño."
- "13 a 17: adolescente."
- "18 a 64: adulto."
- "65+: senior."
- "no legible o sin args: error y exit 1."

## Errores típicos

- [object Object]
- Usar `and` en vez de `&&` o `-a`: Bash NO entiende `and`/`or`.

---

*~9 min · Nivel 5 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
