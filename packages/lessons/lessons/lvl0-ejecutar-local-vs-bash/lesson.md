# Ejecutar: ./script.sh vs bash script.sh

> **Objetivo:** Distinguir ejecutación directa de interpretación por bash.

## Teoría

`./script.sh` pide al kernel ejecución directa (he indica un shebang). Con `bash script.sh`, tú abres bash y le pasas el archivo; no importan los permisos.

¿Y `source script.sh` (o `. script.sh`)? Ejecuta el código EN tu shell actual: alerta, la filosofía puede arrastrar variables que afecten a tu entorno. `$0` dentro de un script es su nombre; te dirá cómo fue invocado.

## Ejemplo guiado

```bash
$ ./hello.sh       # requiere +x
$ bash hello.sh    # no necesita permisos
$ bash misma.sh
vertical: misma.sh
```

## Tu reto

Crea `runme.sh` (shebang + `echo "Modo ./"`) ejecutable, y `misma.sh` con `echo "vertical: $0"`. Ejecuta `./runme.sh` y `bash misma.sh`.

## Errores típicos

- `./runme.sh` sin +x lanza `Permission denied`.
- `$0` en un script es el nombre del script, no de tu shell.

## Mini-quiz

¿Cuándo NO conviene `source script.sh`?

<details><summary>Ver respuesta</summary>

Cuando el script espera argumentos ($1…) o puede sare variables que no quieras tocar.

</details>

---

*~6 min · Nivel 0 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
