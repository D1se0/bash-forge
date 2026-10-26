# source: bibliotecas de código compartido

> **Objetivo:** Compartir funciones entra scripts con source, no copiar/pegar.

## Teoría

`source ./lib.sh` (o `. ./lib.sh`) ejecuta el fichero MIS shell: sus funciones y variables quedan disponibles.

Un patrón clásico: `lib.sh` define utilidades; los scripts la cargan con un guard para errores:

```bash
source "${BASH_SOURCE[0]%/*}/lib.sh"
```

## Ejemplo guiado

```bash
$ cat lib.sh
quien_soy() { forja: $0 }
$ . ./lib.sh && quien_soy
```

## Tu reto

Crea `lib.sh` con una función `medir` que imprima `medir: <arg>`, y `usalib.sh` que la cargue con `source lib.sh` y la llame con `herramienta`.

## Errores típicos

- Ruta relativa rota: si ejecutas desde otro cwd, `source lib.sh` falla. Usa rutas absolutas o cd antes.
- [object Object]

## Mini-quiz

¿Diferencia entre `source lib.sh` y `bash lib.sh`?

<details><summary>Ver respuesta</summary>

source corre EN tu shell (funciones que quedan); bash crea un proceso nuevo que termina con sus cosas.

</details>

---

*~7 min · Nivel 4 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
