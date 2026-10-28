# Integridad: sha256sum básico

> **Objetivo:** Fichar un fichero y comparar el hash para saber si cambió.

## Teoría

`sha256sum fichero` imprime el hash. Cualquier byte distinto cambia el resultado. Sirve para detectar archivos corruptos o modificados.

## Tu reto

Crea `ficha.sh` que imprima el hash SHA-256 de $1 (solo el hash, sin el nombre del fichero).

## Errores típicos

- Olvidar la primera columna cut -d' ' -f1: se mezcla el hash con el nombre.

---

*~8 min · Nivel 8 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
