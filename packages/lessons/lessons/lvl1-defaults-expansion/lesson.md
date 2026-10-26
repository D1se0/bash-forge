# Valores por defecto: ${var:-x}, :=, :? y :+

> **Objetivo:** Dar valores por defecto, exigir variables y detectarlas sin if.

## Teoría

La expansión de parámetros soluciona lógica sin if:

- `${VAR:-defecto}`: defecto si VAR está vacía o sin definir.
- `${VAR:=defecto}`: defecto Y asigna a VAR.
- `${VAR:?mensaje}`: aborta el script con mensaje si VAR falta.
- `${VAR:+algo}`: solo si VAR TIENE valor, devuelve algo.

## Ejemplo guiado

```bash
$ cat fallback.sh
#!/usr/bin/env bash
echo "Puerto: ${PORT:-8080}"
$ bash fallback.sh
Puerto: 8080
$ PORT=9000 bash fallback.sh
Puerto: 9000
```

## Tu reto

Crea `fallback.sh` que imprima `Saludo: ${SALUDO:-hola por defecto}`. El test lo prueba de dos modos: sin variable y con `SALUDO=coder`.

## Errores típicos

- `$VAR:-defecto` sin las llaves: `$VAR` expande primero y «:-defecto» queda literal.
- Confundir `:-` (si falta) con `:+` (si está).

## Mini-quiz

¿Qué hace ${NOMBRE:?falta NOMBRE}?

<details><summary>Ver respuesta</summary>

Aborta el script con exit 1 mostrando «falta NOMBRE» si NOMBRE no vale nada.

</details>

---

*~8 min · Nivel 1 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
