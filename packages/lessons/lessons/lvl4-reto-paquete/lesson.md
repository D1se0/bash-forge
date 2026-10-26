# Reto · El instalador idempotente chiquito

> **Objetivo:** Un instalador que puedes ejecutar DOS veces sin estropearse.

## Teoría

**Idempotencia**: ejecutar algo 2 o 200 veces deja el MISMO estado. Para eso: checks antes de crear (existencia de ficheros), `-p` para mkdir, Noise cordial cuando no hace nada.

## Tu reto

Crea `instalador.sh` que:
- "cree la carpeta `instalado/` con -p,"
- "cree el fichero `instalado/VERSION` con `1.0.0` SOLO si no existe,"
- "imprima `instalando…` cuando se creó algo y `nada que hacer` cuando ya estaba."

## Errores típicos

- [object Object]
- Usar mkdir sin -p y morir al corromper segundo.

## Mini-quiz

¿Qué es idempotencia con palabras clavos?

<details><summary>Ver respuesta</summary>

Ejecutarlo más veces NO cambia el resultado final.

</details>

---

*~14 min · Nivel 4 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
