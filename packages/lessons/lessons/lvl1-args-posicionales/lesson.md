# Argumentos: $1…$9, ${10}, $# y el resto

> **Objetivo:** Leer parámetros posicionales y contarlos, dependiendo de la décima.

## Teoría

Llamas `script a b c` y dentro: `$1=a`, `$2=b`… `$#` es el número. Desde el 10 la zona NO general: `$10` se lee como `$1`+"0"; usa `${10}`. `$0` es el nombre del script.

## Ejemplo guiado

```bash
$ cat params.sh
#!/usr/bin/env bash
echo "Total: $#"
if [ $# -ge 10 ]; then echo "Décimo: ${10}"; fi
```

## Tu reto

Crea `params.sh` que diga `Recibidas N piezas` ($#) e imprima `Pieza 1 → <valor>` por cada arg. Debe responder 10+ args también (¡${11} con llaves!).

## Errores típicos

- Usar `$10` para el décimo: Bash lo lee como `$1` concatenado con "0".
- [object Object]

## Mini-quiz

Con ./params alfa beta, ¿qué vale $1 y $#?

<details><summary>Ver respuesta</summary>

$1 = alfa; $# = 2. ($0 sigue siendo el nombre del script.)

</details>

---

*~8 min · Nivel 1 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
