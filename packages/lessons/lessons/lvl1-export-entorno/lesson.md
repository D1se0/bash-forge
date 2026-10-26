# export y unset: el entorno que heredan tus scripts

> **Objetivo:** Publicar variables al child processes y limpiarlas con unset.

## Teoría

Las variables de tu shell solo viajan a los hijos si están **exportadas**.

- `export VAR=valor`: la hace heredable.
- `unset VAR`: la borra.
- Verificación: `env | grep VAR` o `printenv VAR`.

## Ejemplo guiado

```bash
$ LLAVE=cocina bash hijo.sh     # temporal ✓
Veo: cocina
$ bash hijo.sh                  # sin export, no la ve
Veo: nada
```

## Tu reto

Crea `hijo.sh` que imprima `Veo: ${LLAVE:-nada}`, y `envpass.sh` que exporte `LLAVE=emergencias` y llame a `bash hijo.sh`.

## Errores típicos

- `export LLAVE = emergencias` con espacios: eso ejecuta 'export' con tres palabras.
- Olvidar export y solo asignar en el padre: el hijo ve «nada».

## Mini-quiz

`VAR=1 bash hijo.sh` vs `export VAR; bash hijo.sh`.

<details><summary>Ver respuesta</summary>

La primera es temporaria para ese hijo; la segunda exporta para todo lo que lances después.

</details>

---

*~7 min · Nivel 1 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
