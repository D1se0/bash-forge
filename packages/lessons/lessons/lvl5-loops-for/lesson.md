# for sobre listas y secuencias

> **Objetivo:** Recorrer elementos fijos y generados por seq.

## Teoría

`for x in a b c; do echo $x; done` te deja iterar sobre espacio-separado. Con seq generas listas de números.

## Tu reto

Crea `recorrido.sh` que reciba un número N y encadene N líneas `paso i` para i=1 .. N.

## Errores típicos

- [object Object]
- Olvidar el ; después de la lista: `for i in $(seq 1 10) do` NO compila.

---

*~10 min · Nivel 5 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
