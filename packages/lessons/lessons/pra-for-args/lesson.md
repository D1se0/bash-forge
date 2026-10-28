# FOR: recorrer los argumentos

> **Objetivo:** Iterar "$@" respetando espacios y contarlas al final.

## Teoría

Para los argumentos del script usa `"$@"` (entre comillas):

```bash
for arg in "$@"; do
  echo "$arg"
done
echo "total: $#"
```

`"$@"` mantiene cada argumento entero (con sus espacios);
sin comillas, `"dos palabras"` se partiría en dos vueltas.

## Ejemplo guiado

```bash
$ bash pasa-por-agua.sh a "b c" d
arg: a
arg: b c
arg: d
total: 3
```

## Tu reto

Crea `pasa-por-agua.sh` que imprima cada argumento como `arg: <arg>`
(con espacios intactos) y al final `total: N`. Debe funcionar con
cualquier número de argumentos, incluso cero (sólo imprima `total: 0`).

## Errores típicos

- `for arg in $@`: sin comillas, los espacios partidos separan argumentos.
- Usar `$#` después de `shift`: cuenta lo que queda, no lo original.

---

*~6 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
