# break / continue: manotazos de emergencia

> **Objetivo:** Cortar bucles temprano y saltar elementos indeseados.

## Teoría

- `break`: sale del bucle inmediatamente.
- `break 2`: sale de DOS niveles anidados.
- `continue`: salta al siguiente elemento pero sin cerrar el bucle.

## Ejemplo guiado

```bash
$ for n in 1 2 3 4 5; do
    [ $n -eq 2 ] && continue
    [ $n -eq 4 ] && break
    echo $n
  done
1
3
```

## Tu reto

Crea `selectivo.sh` que recibe 4+ args e imprime cada uno, pero saltando todos los que empiezan por guión (`-malo` se menos…) y parando al ver `STOP`.

## Errores típicos

- `continue` fuera de un bucle: warning y las tortugas no avanzan.
- [object Object]

## Mini-quiz

¿Qué hace `break 2` dentro de dos bucles anidados?

<details><summary>Ver respuesta</summary>

Sale del bucle interior Y del exterior (nivela con dos niveles).

</details>

---

*~6 min · Nivel 3 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
