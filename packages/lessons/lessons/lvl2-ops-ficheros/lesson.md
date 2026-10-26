# La tabla de ficheros: -e -f -d -r -w -x -s y la cuña

> **Objetivo:** Distinguir existencia, tipo, permisos y tamaño con test de ficheros.

## Teoría

Los operadores de fichero más usados (el `[ -f fichero ]` ¡con espacios!):

- `-e`: existe · `-f`: fichero regular · `-d`: directorio
- `-r/-w/-x`: te legible/escribible/ejecutable
- `-s`: existe y **no vacío**
- `-L`/`-h`: symlink · `-N`: modificado después de leído
- `f1 -nt f2`: más nuevo que · `-ot`: más viejo · `-ef`: mismo i-nodo

Hay más (`-b -c -p -S -O -G -k -u -g -t`), pero estos ocho arrancan el 95 % de los scripts.

## Ejemplo guiado

```bash
$ if [ -f "./vars.sh" ]; then echo "es fichero"; fi
$ if [ -d "/home" ]; then echo "es dir"; fi
$ ls > vacio.txt  # no lo produce; test cómo -s da false
```

## Tu reto

Crea en tu home `es-papel.sh` que reciba $1 y decida en ESTE orden:
- si es dir: `CARPETA`
- si es fichero vacío: `PAPEL EN BLANCO`
- si es fichero con contenido: `FICHERO`
- si no existe: `FANTASMA`

## Errores típicos

- `[-f x]` sin espacios: Bash cree que es una firma `[-f]`… error.
- Poner `[[ -f ]]` en sh POSIX (dash): no existe; aquí estamos en bash, puedes usarlo.

## Mini-quiz

¿Diferencia entre `-e x` y `-f x`?

<details><summary>Ver respuesta</summary>

-e = existe lo que sea (dir, fichero, enlace); -f = es fichero regular.

</details>

---

*~8 min · Nivel 2 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
