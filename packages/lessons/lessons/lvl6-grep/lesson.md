# grep: bucear en el texto

> **Objetivo:** Filtrar líneas por patrón y contar coincidencias.

## Teoría

`grep patron fichero` imprime las líneas que matchean; `-c` cuenta; `-i` ignora mayúsculas; `-v` invierte ('los que NO').

## Tu reto

Se creó `notas.txt` con varias líneas de texto. Crea `contar.sh` que reciba un patrón e imprima cuántas líneas lo contienen.

## Errores típicos

- Olvidar comillas alrededor del patrón si tiene espacios o `*`.
- Confundir -c (cuenta de LÍNEAS matcheadas) con el número de pares.

---

*~8 min · Nivel 6 (Herrero de élite) · pulsa **Comprobar** cuando lo tengas.*
