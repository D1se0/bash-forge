# Estructura de un script profesional

> **Objetivo:** Ordenar tu script: shebang, variables, funciones y main.

## Teoría

Esqueleto Q&A:

```bash
#!/usr/bin/env bash
set -euo pipefail        # (se detalla en nivel 7)
readonly SCRIPT_NAME="$(basename "$0")"

funcion_a() { … }
funcion_b() { … }

main() {
  funcion_a
  funcion_b
}
main "$@"
```

Ventajas: main() con args explícitos hace TESTABLE el script (sources...), variables en arriba, funciones en el medio, main al final.

## Ejemplo guiado

```bash
$ bash beatriz.sh
…
```

## Tu reto

Reescribe `beatriz.sh` con la estructura completa: defina `saluda()` e imprime `Beatriz saluda: versión 1.0`, y main() la invoque. Añade la línea `readonly VERSION="1.0"`.

## Errores típicos

- [object Object]
- [object Object]

## Mini-quiz

¿Por qué A-NALIZAR main "$@"?

<details><summary>Ver respuesta</summary>

Hace que el punto de entrada sea explicito, testable y analizable.

</details>

---

*~8 min · Nivel 4 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
