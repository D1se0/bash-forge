# WHILE: leer un fichero línea a línea

> **Objetivo:** while IFS= read -r con contador de líneas.

## Teoría

La forma correcta de leer un fichero en bash:

```bash
n=0
while IFS= read -r linea; do
  n=$((n + 1))
done < fichero.txt
echo "líneas: $n"
```

`IFS=` conserva los espacios de la línea, `-r` evita que `\` escape.
La redirección `< fichero.txt` alimenta al read; si hicieras
`cat fichero | while …`, la variable n moriría en la subshell.

## Ejemplo guiado

```bash
$ bash cuenta-lineas.sh notas.txt
líneas: 3
```

## Tu reto

Crea `notas.txt` con 3 líneas cualesquiera y `cuenta-lineas.sh` que
reciba un fichero como $1 e imprima `líneas: N` contando con while
read -r (no con wc -l: quiero el bucle).

## Errores típicos

- `cat fichero | while read`: el contador se pierde en la subshell.
- Olvidar `< fichero` al final del done: el while se queda esperando entrada.

---

*~6 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
