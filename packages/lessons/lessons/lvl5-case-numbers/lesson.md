# case para rangos numéricos

> **Objetivo:** Elegir ramas por comparaciones numéricas con case/glob.

## Teoría

case compara con glob, no con aritmética. Para rangos numéricos: usar expansión [n-m] como alfabético hace trampas. Alternativa honesta: usar if/elif con -lt -ge.

## Tu reto

Crea `rango.sh` que pida dos argumentos: min y max, y luego imprima si $1 (tercero) está dentro:
- "dentro si min <= x <= max: imprime dentro."
- "fuera si no: fuera."

## Errores típicos

- Comparar como texto: 10 viene antes que 9. Si importa el ORDEN, usa -lt/-ge.

---

*~9 min · Nivel 5 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
