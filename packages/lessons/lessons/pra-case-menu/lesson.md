# CASE: menú en bucle (case dentro de while)

> **Objetivo:** Combinar while + case: el patrón del menú interactivo.

## Teoría

El patrón «menú de consola» combina las dos piezas de esta pista:

```bash
while read -r op; do
  case "$op" in
    hola) echo "¡hola!" ;;
    salir) echo "adiós"; break ;;
  esac
done
```

`while read -r` acaba solo cuando la entrada se agota (sin bucles
infinitos al EOF); `break` cierra antes. `exit 0` no termina el menú:
termina el SCRIPT entero. Este binomio while+case es el corazón
de casi todo script interactivo.

## Ejemplo guiado

```bash
$ printf 'hola\nsalir\n' | bash menu.sh
¡hola!
adiós
```

## Tu reto

Crea `menu.sh` que lea una línea por ronda: si es `hola`, imprime
`¡hola!`; si es `salir`, imprime `adiós` y termina (break). Usa el
patrón robusto: el propio `while read -r op` marca el círculo (no
`while true`, que no sabe cuándo se acaba la entrada).

## Errores típicos

- `while true; do read` sin escapar al EOF: en una pipe, al acabarse la entrada el menú gira para siempre.
- case dentro de while en una pipe: break rompería la SUBshell del while; con `while read` directo no hay subshell.
- Olvidar el `;;` del caso de salir antes del esac.

---

*~7 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
