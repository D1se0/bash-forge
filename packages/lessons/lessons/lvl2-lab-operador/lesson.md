# Laboratorio interactivo · Operator Lab

> **Objetivo:** Confeccionar tu propio tester de operadores de test sobre ficheros.

## Teoría

El **Operator Lab** no es una lección más: es un banco de pruebas que TÚ te construyes. En un script, el primer arg es el operador y el segundo el fichero; decide el resultado del test:
- si es fichero: `-e -f -d -r -w -x -s -L`
- si son dos ficheros: `-nt -ot -ef`
- si son cadenas/números: los cortos que sabes.

Out: ` OPERADOR: [es|no] true ` — el test comprueba la forma ES-X y dice si el operador verificó.

## Ejemplo guiado

```bash
$ bash operador.sh -f vars.sh
-f: sí true
$ bash operador.sh -d vars.sh
-d: no true (no es dir)
```

## Tu reto

Crea `operador.sh` que soporte al menos `-e -f -d -s` sobre $2, imprimiendo:
`TEST $1: ok|no`. Si no conoce el operador: `TEST $1: desconocido`.

## Errores típicos

- Confundir el ORDEN de los args en el operador dentro del if.
- Pasar un `[[ -$1 $2 ]]` dinámico: no se puede evaluar así; usa un case.

## Mini-quiz

¿Cómo se puede hacer un -f dentro de un case?

<details><summary>Ver respuesta</summary>

`case $1 in -f) [[ -f $2 ]] && exit 0 || exit 1 ;;` … o con eval en una mera (¡cuidado!).

</details>

---

*~10 min · Nivel 2 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
