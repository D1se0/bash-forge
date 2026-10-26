# La demo visual: "$@" vs $*

> **Objetivo:** Ver con variables y espacios por qué \"$@\" conserva y $* funde.

## Teoría

Ambos expanden todos los argumetos, pero:

- `"$@"`: cada uno es una pieza aparte (los espacios internos se preservan).
- `$*` (o `"$*"`): todos en una cadena, pegados por el primer char de `IFS` (normalmente espacio).

Es la diferencia más importante para escribir scripts sin el síndrome de espacios rotos.

## Ejemplo guiado

```bash
$ cat args.sh
#!/usr/bin/env bash
printf 'arg: %s\n' "$@"
echo "fusión: $*"
$ bash args.sh "uno solo" dos
arg: uno solo
arg: dos
fusión: uno solo dos
```

## Tu reto

Crea `args.sh` que imprima una línea por argumento (`arg: <valor>`) y una última `fusión: <todos pegados>`. Verificala con `bash args.sh "dos palabras" tres`.

## Errores típicos

- `printf '%s' "$@"` sin \n: los args salen pegados sin saltos.
- `for arg in $@` sin comillas: el splitting rompe los espacios.

## Mini-quiz

¿Qué imprime printf con formato líneaxN y los argumentos «a b» y «c»?

<details><summary>Ver respuesta</summary>

Dos líneas: «a b» y «c». La comilla de "$@" preserva los cadens con espacios.

</details>

---

*~8 min · Nivel 1 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
