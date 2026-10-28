# IF: dos condiciones a la vez (&& y -a)

> **Objetivo:** Combinar-tests en un único if con && y !.

## Teoría

Un solo if puede pedir dos cosas:

```bash
if [ -x "$1" ] && [ -r "$1" ]; then echo "ok"; fi
```

También `[[ ... && ... ]]` (bash puro) o el histórico `-a`.
La negación es `!`: `if ! [ -f "$f" ]`.

## Ejemplo guiado

```bash
$ bash acceso.sh /bin/ls
ok
$ bash acceso.sh /etc/hostname   # legible pero no ejecutable
no ok
```

## Tu reto

Crea `acceso.sh` que imprima `ok` cuando el fichero $1 sea ejecutable
Y legible a la vez, y `no ok` si falla cualquiera de las dos cosas.

## Errores típicos

- Escribir `if [ -x $1 ] && -r $1 ]`: cada test necesita SUS corchetes.
- `if [ -x "$f" ] -a [ -r … ]`: el -a va DENTRO de una sola pareja de corchetes.

---

*~5 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
