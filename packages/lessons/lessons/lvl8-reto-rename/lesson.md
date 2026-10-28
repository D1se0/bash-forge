# Reto · Renombrador masivo

> **Objetivo:** Renombrar ficheros aplicando ?????raw y contraendo con mv.

## Teoría

Combina for + basename + mv + condicionar que exista antes de sobreescribir.

## Tu reto

Crea `rename.sh <dir> <buscar> <cambiar>` que:
- "Recorra todos los ficheros .txt en dir."
- "Les compare si contienen buscar."
- "Imprima las rutas que matchean."

## Errores típicos

- No coger las rutas con espacios: for sobre *"$(find ...)"* los rompe.

---

*~18 min · Nivel 8 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
