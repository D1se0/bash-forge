# for reforzado: "$@", globs y listas mixtas

> **Objetivo:** Dominar las tres formas de alimentar un for sin romper espacios.

## Teoría

Tres maneras de dar lista a un `for`, cada una con su truco:

```bash
for a in "$@"; do ... done        # argumentos, espacios intactos
for f in *.csv; do ... done       # glob del directorio actual
for x in 1 2 3 "dos palabras"; do ... done  # lista literal (¡comillas!)
```

Sin comillas, `"dos palabras"` se parte en DOS vueltas del bucle: es el
bug clásico. Este nivel lo repite hasta que salga solo.

## Ejemplo guiado

```bash
$ bash alimentador.sh hola "dos palabras" fin
voc: hola
voc: dos palabras
voc: fin
```

## Tu reto

Crea `alimentador.sh` que imprima cada argumento como `voc: <arg>` con
espacios intactos (`bash alimentador.sh "dos palabras"` da UNA línea).
Añade al final la línea `vocadas: N` con el número total de argumentos.

## Errores típicos

- Iterar sin comillas `for a in $@`: el espaciado dentro de los args rompe la lista.
- Contar con `$#` cuando ya hiciste `shift` antes: cuenta de la lista ACTUAL.

## Mini-quiz

¿Cómo recorrerías los argumentos y además sabrías su índice 1..N?

<details><summary>Ver respuesta</summary>

Con `i=1` fuera del bucle, `for a in "$@"; do … ; i=$((i+1)); done`.

</details>

---

*~8 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
