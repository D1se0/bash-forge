# Reto · Mini calculadora de clases

> **Objetivo:** Arma una calculadora con funciones por operación.

## Teoría

Combination de funciones + case + aritmética. Sin teoría: aplica.

## Tu reto

Crea `calc.sh` que reciba `num op num` (num = enteros; op ∈ {+,-,x,/}) e imprime el resultado. Para multiplicar usa `x` (la * es glob). Con división por cero: `no dividir cero` y exit 1.

## Errores típicos

- Usar `/` y no revisar cero: (( $2 / 0 )) abort frames el script con exit ≠0.
- Recuerda separar bien los argumentos con espacios; la multiplicación usa la letra x.

## Mini-quiz

¿Exacto error con 2/0 en (( ))?

<details><summary>Ver respuesta</summary>

Divide by zero error y el (( )) devuelve exit ≠ 0 (a menos que set +e…).

</details>

---

*~12 min · Nivel 4 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
