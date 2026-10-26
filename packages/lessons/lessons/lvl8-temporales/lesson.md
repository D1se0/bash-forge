# mktemp y ficheros temporales

> **Objetivo:** Crear ficheros temporales únicos con trap EXIT y limpieza.

## Teoría

`mktemp` devuelve una ruta única en /tmp. Combinar con `trap 'rm -f "$tmp"' EXIT` para limpiar SIEMPRE, incluso si algo falla en el medio.

## Tu reto

Crea `temporal.sh` que:
- "Cree un tmp con mktemp."
- "Escriba hola temporales en él, imprima su contenido."
- "Limpie con trap EXIT."

## Errores típicos

- [object Object]

---

*~10 min · Nivel 8 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
