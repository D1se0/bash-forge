# for estilo C: la interfaz de los algoritmófilos

> **Objetivo:** Usar for (( i=0; i<n; i++ )) como en la escuela de C.

## Teoría

Bash también admite un `for` C-style:

```bash
for (( i = 0; i < 10; i++ )); do …; done
```

El cuerpo corre con aritmética nativa (sin `$`). Único detalle: no se rompe con `set -e` si el i++ devuelve 0 (verás en nivel 7).

## Ejemplo guiado

```bash
$ for ((i=1; i<=3; i++)); do echo "vuelta $i"; done
vuelta 1
vuelta 2
vuelta 3
```

## Tu reto

Crea `cuenta3.sh` con for C-style que imprima `time X` para X=0..4 (5 líneas, empezando por 0).

## Errores típicos

- For C-style con $i dentro: dentro del (( )) se usan nombres SIN $.
- [object Object]

## Mini-quiz

¿Diferencia entre `i++` y `++i` dentro del(( ))?

<details><summary>Ver respuesta</summary>

Ambos suben en uno; el valor INTERNO asignable (x=$(i++)) da el valor previo con i++.

</details>

---

*~6 min · Nivel 3 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
