# Brace expansion: {1..10}, {a..c} y {x,y,z}

> **Objetivo:** Generar listas sin escribir a mano.

## Teoría

La expansión de llaves produce listas sin ejecutar nada:

- `{1..5}` → 1 2 3 4 5
- `{1..10..2}` → 1 3 5 7 9 (paso 2)
- `{a..c}` → a b c
- `file.{conf,log}` → file.conf file.log (¡coladas de nombres!)

Se expande ANTES que el globs y no depende del fichero sistema.

## Ejemplo guiado

```bash
$ echo {1..3}
1 2 3
$ echo {a..c}-{1..2}
a-1 a-2 b-1 b-2 c-1 c-2
$ touch {config,data}.{bak,txt}   # crea 4 ficheros de golpe
```

## Tu reto

Crea `coladas.sh` que genere los ficheros `dias.{lunes,viernes}` vacíos con la expansión (una línea, touch) e imprima `Febrero {feb01..feb05}`? (vale, que imprima `feb01` a `feb05` con un for en líneas).

## Errores típicos

- [object Object]
- [object Object]

## Mini-quiz

¿Qué imprime `echo {2..8..3}`?

<details><summary>Ver respuesta</summary>

2 5 8 (empieza en 2, salta cada 3).

</details>

---

*~6 min · Nivel 3 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
