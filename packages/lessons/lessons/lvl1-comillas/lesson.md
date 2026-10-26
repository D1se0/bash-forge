# Comillas: simples, dobles y $'…'

> **Objetivo:** Elegir la comilla correcta y entender word-splitting.

## Teoría

Tres maneras de acotar texto:

1. **Dobles** `"…"`: expanden `$var`, `$(cmd)`.
2. **Simples** `'…'`: TODo literal, ni $ ni escapes.
3. `$'…'`: ANSI string que interpreta escapes (`a\tb` es a+tab).

Cuidado con el **word-splitting**: `$frase` sin comillas se rompe en palabras; `"$frase"` viaja entera.

## Ejemplo guiado

```bash
$ frase="hola que tal"
$ printf '%s\n' $frase       # tres líneas!
$ printf '%s\n' "$frase"     # una sola
$ echo $'tab\there'
tab	here
```

## Tu reto

Crea `quotes.sh` que defina `frase="cinco seis siete"` e imprima:
1. `expandida: cinco seis siete`
2. `literal: $frase` (¿cómo haces un `$frase` literal?)

## Errores típicos

- `echo "literal: '$frase'"` FALSA: sigue expandiendo (el "$" no está escapado).
- Confundir `$'frase'` (ANSI) con `'$frase'` (literal).

## Mini-quiz

¿Cómo imprimes un tab ENTRE palabras?

<details><summary>Ver respuesta</summary>

Con `echo $'a\tb'` o `printf 'a\tb\n'` (el `$'…'` interpreta escapes).

</details>

---

*~8 min · Nivel 1 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
