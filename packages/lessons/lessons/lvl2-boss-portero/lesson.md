# Boss Fight · El Portero de Herrero

> **Objetivo:** Examen máximo de condicionales: ficheros, cadenas y números juntos.

## Teoría

Un Boss de condicionales mezcla TODO tu arsenal: controles de ficheros, comparaciones de cadenas y números. Y sin pistas. Cinco args, cinco exámenes.

## Tu reto

Crea `portero.sh` con args: 1) comando `check`, 2) fichero, 3) modo `{dir|emp|obj|no-existe}` y 4) umbral num...
Simplifiquemos al fénix: el portero reta:
1. Con `check fichero`: imprima `FICHERO` si es fichero con contenido, `VACIO` si está vacío, `DIR` si carpeta, `NO` si no existe.

## Errores típicos

- El orden decide: primero el inexistente, luego -d, luego -s, luego vacío.
- La flag -s (no vacío) NO es lo mismo que la flag -f.

---

*~15 min · Nivel 2 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
