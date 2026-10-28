# Boss Fight · El Guardian de Bucles

> **Objetivo:** Examen final de bucles: for, while, case, break/continue juntos.

## Teoría

El jefe une TODO lo de este nivel y el 3: lee fichero con while IFS=
read -r (sin subshell), enruta cada línea con case, acumula en
variable y corta con break. Nada de awk/sed/cut: SOLO bucles.

```bash
rumbo=0
while IFS= read -r l; do
  case "$l" in
    "subir "*) rumbo=$((rumbo + ${l#subir })) ;;
    stop) break ;;
  esac
done < manifiesto.txt
```

## Ejemplo guiado

```bash
$ cat manifiesto.txt
subir 10
# otro día
subir 20
stop
$ bash guardian.sh
rumbo: 30
```

## Tu reto

Crea `manifiesto.txt` con (EXACTAS): línea 1 `subir 10`, línea 2
`# comentario`, línea 3 `subir 20`, línea 4 `stop` y línea 5 `subir 99`.
Crea `guardian.sh` que lea el fichero línea a línea: `subir N` suma a
`rumbo`; líneas `#…` se saltan; `stop` corta de inmediato (la línea 5 NO
se llega a leer); al final imprime `rumbo: N`.

## Errores típicos

- Sumar 99: el stop cortó el fichero y esa línea ni existió para ti.
- Leer con `cat | while`: pierdes el total (subshell).
- No saltar comentarios: algún `# …` sumaría cero pero ensuciaría (hazlas saltar de verdad).

## Mini-quiz

¿Por qué la línea 5 no va?

<details><summary>Ver respuesta</summary>

El break al leer `stop` sale del while de inmediato sin volver al fichero.

</details>

---

*~15 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
