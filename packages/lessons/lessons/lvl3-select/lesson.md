# select: menús interactivos de regalo

> **Objetivo:** Formúlale un menú con select y consciente read con restricciones.

## Teoría

`select var in opciones; do …; done` genera un MENÚ numerado y lee la elección;_PS3 es el prompt. Unaclassic: while en loop hasta que el usuario define salida.

Alternativa sin select: `read -p` con validación (más manual pero igual con while true + break).

## Ejemplo guiado

```bash
$ cat menu.sh
#!/usr/bin/env bash
select opt in "horno" "fragua" "salir"; do
  [ "$opt" = "salir" ] && break
  echo "tomaste: $opt"
done
```

## Tu reto

Crea `menu.sh` que muestre y procese un menú con `select` y opciones `piedra papel tijera salir` (¡en ese orden: `salir` es la opción 4!). Ojo: `select` imprime el menú por stderr.
El check envía `4\n` (opta por salir: menú visible y exit limpio por break) y `3\n4\n` (toma `tijera` y luego sale).

## Errores típicos

- [object Object]
- [object Object]

## Mini-quiz

¿Qué variable eligió el índice elegido en select?

<details><summary>Ver respuesta</summary>

REPLY abre el número elegido; la variable tomada trae el texto.

</details>

---

*~7 min · Nivel 3 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
