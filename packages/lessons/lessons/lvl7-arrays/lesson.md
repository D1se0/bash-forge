# Arrays indexados

> **Objetivo:** Declarar, leer, recorrer y medir un array.

## Teoría

`arr=(a b c)`; `${arr[0]}` el primero; `${arr[@]}` todos; `${#arr[@]}` el tamaño; `for x in "${arr[@]}"`.

## Tu reto

Crea `lista.sh` que declare un array con 3 frutas y recorra imprimiendo `fruta: X`.

## Errores típicos

- [object Object]
- Usar corchetes vacíos creyendo que es como el último índice: en bash moderno es ${arr[@]: -1}.

---

*~12 min · Nivel 7 (Herrero de élite) · pulsa **Comprobar** cuando lo tengas.*
