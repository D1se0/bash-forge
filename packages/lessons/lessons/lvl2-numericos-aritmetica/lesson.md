# Números: -eq -ne -lt -le -gt -ge y (())

> **Objetivo:** Comparar números y hacer aritmética con ((contexto)).

## Teoría

Los comparadores numéricos iban por test clásicos: `-eq` igual, `-ne` no igual, `-lt` menor que, `-le` menor/igual, `-gt` mayor, `-ge` mayor/igual.

Con doble paréntesis `(( ))`:
- `(( a > b ))` compara números
- `(( x + 1 ))` evalúa expresión y devuelve exit 0 si el RESULTADO ≠ 0.
- `x=$(( x + 1 ))` asigna.

Regla: `[ ]` para shell puro, `(( ))` para aritmética y readabilidad.

## Ejemplo guiado

```bash
$ (( 1 + 1 == 2 )) && echo cierto
cierto
$ x=5; x=$(( x * 2 )); echo $x
10
```

## Tu reto

Crea `numeros.sh` con $1 (un nº): imprime `PAR` si (( n % 2 == 0 )) y `IMPAR` en caso contrario. Debe aceptar negative ACtitud: `-3` es IMPAR.

## Errores típicos

- `(( n % 2 ))` sin ==: devuelve el REMAINder como exit code; para CLARIDAD mejor `(( n % 2 == 0 ))`.
- Comparar cadenas con -gt: usa [[ ]] para cadenas o (( )) para números.

## Mini-quiz

¿Cuándo escoges (( )) sobre [ ]?

<details><summary>Ver respuesta</summary>

Para aritmética y compáraos numéricos; [ ] para tests POSIX clásico y ficheros.

</details>

---

*~7 min · Nivel 2 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
