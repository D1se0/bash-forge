# case dentro del bucle: el router de comandos

> **Objetivo:** Procesar una cola de órdenes con case por cada vuelta.

## Teoría

La pareja del nivel: `while` trae cada orden y `case` decide qué hacer
con ella. Patrón de router de comandos:

```bash
for orden in "$@"; do
  case "$orden" in
    subir)  echo "ronda 1: SUBE" ;;
    parar)  echo "ronda 2: PARAR"; break ;;
    *)      echo "ronda 3: ???" ;;
  esac
done
```

## Ejemplo guiado

```bash
$ bash enrutador.sh subir subir parar subir
ronda 1: SUBE
ronda 2: SUBE
ronda 3: PARAR
```

## Tu reto

Crea `enrutador.sh` que recorra los args con un for y un case:
`subir` → imprime `ronda N: SUBE`, `bajar` → `ronda N: BAJA`, `parar`
→ `ronda N: PARAR` y DEJA de procesar (nada más después). N es el número
de ronda (1, 2, 3…). Órdenes desconocidas: `ronda N: ???`.

## Errores típicos

- [object Object]
- [object Object]

## Mini-quiz

¿break o exit para «parar»?

<details><summary>Ver respuesta</summary>

break: corta el bucle y sigue el script (aquí nada después, igual).

</details>

---

*~8 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
