# while shift: el router de opciones

> **Objetivo:** Consumir argumentos con while shift hasta vaciarlos.

## Teoría

Patrón clásico de parseo sin getopts:

```bash
while (($#)); do
  case "$1" in
    -v) echo "modo: apagado"; shift ;;
    -n) name="$2"; shift 2 ;;
    *)  echo "misterio $1"; shift ;;
  esac
done
```

## Ejemplo guiado

```bash
$ bash dilema.sh -v -n Ana -v
modo: apagado
persona: Ana
modo: apagado
```

## Tu reto

Crea `dilema.sh`: `-v` imprime `modo: apagado`, `-n <nombre>` guarda el
nombre y al FINAL imprime `persona: <nombre>` (una sóla línea) y
desconocidos: `misterio <arg>` (y sí, sigue). Sin args: `persona: nadie`.

## Errores típicos

- [object Object]
- [object Object]

## Mini-quiz

¿Por qué `while (($#))`?

<details><summary>Ver respuesta</summary>

Mientras QUEDEN argumentos: cuando shift se queda sin lista, $# es 0 y (( )) es falso.

</details>

---

*~9 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
