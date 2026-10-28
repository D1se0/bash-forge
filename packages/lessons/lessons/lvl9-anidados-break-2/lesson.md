# Bucles anidados: break 2 y continue 2

> **Objetivo:** Tablas N x N y el salto a varios niveles a la vez.

## Teoría

Bucles dentro de bucles: el ínterior entero por cada vuelta del exterior.
`break N` y `continue N` cortan N niveles hacia fuera (por defecto 1).

```bash
for i in 1 2 3; do
  for j in 1 2 3; do
    [[ $j -eq 2 ]] && continue 2   # corta el bucle EXTERIOR: salta a la siguiente $i
    echo "$i x $j"
  done
done
```

## Ejemplo guiado

```bash
$ bash duelo.sh 2
d1 x h1
d1 x h2
d2 x h1
d2 x h2
```

## Tu reto

Crea `duelo.sh`: recibe N y con bucles anidados imprime `d1 x h1` hasta
`dN x hN` (todo el cuadrado N x N, fila por fila). Después de la primera
fila completa esquivar `continue 2` no hace falta; lo que QUIERO es que
uses `break 2`: si N >= 4 imprime SOLO las filas hasta d3 (sin d4 en
adelante) y termina. Comprueba con N=6.

## Errores típicos

- break solo corta el bucle INTERIOR: el exterior seguiría con d4, d5…
- Imprimir con espacios raros entre dN y x: el check pega `dN x hM` literal.

## Mini-quiz

¿Cuántas líneas imprime `duelo.sh 6` con la regla de corte?

<details><summary>Ver respuesta</summary>

Solo las 3 filas de «d» (tales que d1..d3 x h1..h3): 9 líneas.

</details>

---

*~9 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
