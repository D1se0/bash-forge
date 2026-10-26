# ls con lupa: -l, -a, -h y las columnas

> **Objetivo:** Leer la salida de ls -la como un profesional.

## Teoría

`ls -l` imprime una columna por fichero: tipo y permisos (`d` directorio, `-` fichero), nº de enlaces, dueño, **grupo**, tamaño, fecha, nombre. `ls -a` añade los ocultos (los que empiezan por punto, como `.bashrc`); `ls -h` da tamaños legibles (K, M, G). Combínalas: `ls -lah`.

## Ejemplo guiado

```bash
$ ls -a
.  ..  .bashrc  saludo.txt
$ ls -l /etc | head -2
total 1004
drwxr-xr-x  3 root root 4096 Oct  8 07:11 adduser.d
```

## Tu reto

Crea en tu home tres ficheros: `.secreto` (oculto), `publico.txt` y `grande.txt` (un megabyte con `head -c 1M /dev/urandom > grande.txt`). Después guarda en `registro.txt` el resultado de `ls -A` para demostrar que ves el oculto.

## Errores típicos

- `ls` a secas no muestra ocultos: hace falta `-a` o `-A`.
- `head -c 1M` sirve; `head -n 1M` pide LÍNEAS y no genera megas de datos.

## Mini-quiz

En `ls -l`, ¿cómo distingues un directorio de un fichero?

<details><summary>Ver respuesta</summary>

Por el primer carácter: `d` para directorios, `-` para ficheros regulares.

</details>

---

*~6 min · Nivel 0 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
