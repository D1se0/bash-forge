# Ayuda integrada: cat, --help y man

> **Objetivo:** Buscar ayuda antes que Google: cat, --help, man y códigos de salida.

## Teoría

Todo comando acepta `--help` y muchos traen **manual** (`man ls`, `man cat`). Navega con las flechas/space y sal con `q`.

El **código de salida** dice si algo funcionó: `0` = éxito, distinto de `0` = error. Compruébalo con `echo $?` justo después del comando (cada comando nuevo lo sobreescribe).

## Ejemplo guiado

```bash
$ cat saludo.txt
Hola desde Bash Forge
$ cat --help | head -1
Usage: cat [OPTION]... [FILE]...
$ cat no-existe
cat: no-existe: No such file or directory
$ echo $?
1     # error
```

## Tu reto

Guarda en `ayuda.txt` las primeras 12 líneas del man de `cat` (`man cat | head -12 > ayuda.txt`). Luego ejecuta `cat /etc/hostname` a éxito y guarda su `$?` en `exito.txt`.

## Errores típicos

- `echo $?` dos veces seguidas: la segunda ya no vale (otra orden la machaca).
- Salir de `man` con Ctrl+C en vez de `q`: funciona, pero `q` es lo natural.

## Mini-quiz

¿Qué código de salida devuelve `cat fichero-que-no-existe`?

<details><summary>Ver respuesta</summary>

1 (error). Solo el 0 significa «todo bien».

</details>

---

*~5 min · Nivel 0 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
