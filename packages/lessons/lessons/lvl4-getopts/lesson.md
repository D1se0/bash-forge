# getopts: opciones pro (-a -b valor)

> **Objetivo:** Parsear opciones y flags de forma estándar en un script CLI.

## Teoría

`getopts` es el parser de opciones NATIVO de bash:

```bash
while getopts "ab:f" opt; do
  case $opt in
    a) a=$1 ;;
    b) b=$OPTARG ;;
    f) flag=$1 ;;
  esac
done
shift $((OPTIND-1))   # lo que queda en $@ son posicionesales
```

- "`-b valor` (con los dos puntos luego de b) CONSUME un argumento: OPTARG."
- "`b:` define que toma arg; `ab:f` = admite -a, -b valor y -f."

## Ejemplo guiado

```bash
$ cli.sh -a -b 42
$ bash cli.sh -b "texto" archivo
```

## Tu reto

Crea `cli.sh` con getopts que acepte:
- "`-n nombre` → imprime `nombre: $nombre`"
- "`-f` → imprime `furia: sí`"
- opciones posicionales extra mientras $1 exista.

## Errores típicos

- Los dos puntos tras la letra definen si la opción espera argumento.
- No hacer `shift $((OPTIND-1))`: tus args posicionales se mezclan las opciones.

## Mini-quiz

¿Qué es OPTARGS?

<details><summary>Ver respuesta</summary>

es la variable con el VALOR de la opción actual cuando toma un arg (por ej: con -b signt).

</details>

---

*~10 min · Nivel 4 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
