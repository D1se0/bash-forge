# Funciones: empaquetar lógica reutilizable

> **Objetivo:** Definir y llamar funciones con argumentos propios.

## Teoría

Una función define un bloque con nombre:

```bash
saluda() {
  echo "Hola, $1"
}
saluda "Herminia"    # Hola, Herminia
```

Sus argumentos son $1, $2… LOCALES a la llamada (no heredan los del script). `return N` fija el código de salida de la función.

## Ejemplo guiado

```bash
$ cat taller.sh
#!/usr/bin/env bash
funde() {
  echo "fundiendo $1 con $2"
}
funde cobre estaño
```

## Tu reto

Crea `taller.sh` con una función `funde` que imprima `fundiendo A con B` para sus dos argumentos, y llámala con `cobre` y `estaño`.

## Errores típicos

- [object Object]
- [object Object]

## Mini-quiz

¿Los argumentos de la función machacan $1…$# del script?

<details><summary>Ver respuesta</summary>

Solo dentro de la función: al volver, los originales del script reaparecen.

</details>

---

*~7 min · Nivel 4 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
