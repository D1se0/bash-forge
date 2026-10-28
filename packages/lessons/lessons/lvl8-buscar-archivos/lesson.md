# buscar: find con filtros

> **Objetivo:** Localizar fichero por nombre, tamaño o extensión.

## Teoría

`find ruta -name "*.sh" -type f` te da todos los .sh a partir de esa ruta; `-mtime` filtra por días de modificación.

## Tu reto

Crea `explora.sh` que reciba una carpeta e imprima los ficheros `.txt` dentro de ella (no recursivo -maxdepth 1).

## Errores típicos

- Olvidar -maxdepth 1: find baja recursivo por defecto, te devuelve CUALQUIER cosa en subcarpetas.

---

*~12 min · Nivel 8 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
