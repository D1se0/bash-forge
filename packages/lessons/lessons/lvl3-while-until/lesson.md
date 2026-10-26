# while y until: persistencia hasta que salga

> **Objetivo:** Ejecutar mientras (while) o hasta (until) una condición.

## Teoría

`while condición; do …; done` corre WHILE la condición devuelva exit 0.
`until condición` es la cara opuesta: corre HASTA que devuelva 0.

Dentro, `break` rompe y `continue` salta a la siguiente vuelta. Un `sleep` evita que la CPU arda en bucles "infinos".

## Ejemplo guiado

```bash
$ n=3
$ while (( n > 0 )); do echo "lleva $n"; ((n--)); done
lleva 3
lleva 2
lleva 1
```

## Tu reto

Crea `cuenta.sh` con while que cuente desde 3 a 1 (imprima `3`, `2`, `1`) y al final `prrroof … despega ya`. Nada de bucle infinito.

## Errores típicos

- [object Object]
- ((n--)) como comando suelto: cuando n llega a 0 el exit code es ≠0 (y un set -e moriría, más a nivel 7).

## Mini-quiz

¿until condición corre cuando?

<details><summary>Ver respuesta</summary>

Se ejecuta mientras el comando devuelva distinto de 0 y se detiene cuando se cumpla (exit 0).

</details>

---

*~7 min · Nivel 3 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
