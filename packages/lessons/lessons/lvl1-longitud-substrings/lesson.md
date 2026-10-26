# Longitud y troceado: ${#var}, ${var:0:3}, ${var#…}

> **Objetivo:** Medir cadenas y cortar por delante/detrás sin awk.

## Teoría

Expansión para medir y cortar:

- `${#var}`: longitud.
- `${var:2:3}`: rodaja desde el carácter 2, largo 3 (0-indexed).
- `${var#patrón}`: borra del **inicio** lo casante más corto.
- `${var##patrón}`: la versión más larga (grands).
- `${var%patrón}` / `${var%%patrón}`: lo mismo por el **final**.

## Ejemplo guiado

```bash
$ nombre="bashforge.sh"
$ echo ${#nombre}       # 12
$ echo ${nombre:0:4}    # bash
$ echo ${nombre##*.}    # sh
```

## Tu reto

Con `lengua="bashforge.sh"` imprime tres líneas:
1. `cantidad: 12`
2. `comienzo: bash`
3. `extension: sh`

## Errores típicos

- `$#var` sin llaves: mezcla parámetros especiales.
- Confundir `#` (inicio) con `%` (final).

## Mini-quiz

Con f=a/b/c.sh, ¿qué dan ${f##*/} y ${f%/*}?

<details><summary>Ver respuesta</summary>

c.sh (nombre del fichero) y a/b (directorio).

</details>

---

*~8 min · Nivel 1 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
