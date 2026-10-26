# local y return: el alcance de tus variables

> **Objetivo:** Evitar fugas de variables y usar códigos de retorno correctos.

## Teoría

Sin `local`, las variables de una función FUGAN al shell entero. `local var` las encierra en la función.

`return N` devuelve un código (0..255) — para DATOS usa la salida estándar (echo) y captúrala con `$(función)`.

## Ejemplo guiado

```bash
duplica() { echo $(( $1 * 2 )); }
resultado=$(duplica 21)   # 42
es_par() { return $(( $1 % 2 )); }  # 0 = par
```

## Tu reto

Crea `recuento.sh` con una función `cuenta` que cuente de 1 a $1 usando una variable `local`, y devuelva True si llegó a 10+…  Simplifica: imprime la suma 1..N con `echo` y captúrala en `total` desde la llamada. Imprime `total: <suma>`.

## Errores típicos

- `local var=algo` FUERA de una función: error.
- Confundir `return` (exit status) con `echo` (retorno de datos).

## Mini-quiz

¿Cómo devuelves una STRING desde una función?

<details><summary>Ver respuesta</summary>

por stdout con echo/printf y capturando con RESULT=$(funcion).

</details>

---

*~8 min · Nivel 4 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
