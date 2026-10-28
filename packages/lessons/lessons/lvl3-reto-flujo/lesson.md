# Reto · Control libre: tus propias reglas

> **Objetivo:** Armar tu mini programa de flujo: while, for y condición del flag.

## Teoría

Combina. Pequeña consigna: estilo ejecutor CPU-como.
Tres ideasbnb: dentro de un while true, una condición de salida, y `sleep 0` donde el bucle sea bosque.

## Tu reto

Crea `regulador.sh` que reciba N (número) y un flag `--voz`:
- Imprime N líneas `pulso N` (N decreciendo).
- Con `--voz` como segundo arg, imprima `¡COMANDO RECIBIDO!` tras cada pulso.
- Al final: `grácolo fin` (una sola vez).

## Errores típicos

- Omitir la acentuación/diferencia entre "--voz" y "-- voz": los args se comparan EXACTOS.
- Imprimir el mensaje final DENTRO del bucle: una sola vez.

## Mini-quiz

¿Couns comparas un flag entre args?

<details><summary>Ver respuesta</summary>

Con case o if sobre ${2:-}, o iterando los args de "$@" (cuidado la demo del nivel 1).

</details>

---

*~12 min · Nivel 3 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
