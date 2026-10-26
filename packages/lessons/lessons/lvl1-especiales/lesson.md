# Especiales: $?, $$, $!, shift y set --

> **Objetivo:** Leer exit code, PID y reconstruir la lista con shift/set --.

## Teoría

Parámetros especiales:

- `$?`: código de salida del último comando.
- `$$`: PID del shell actual.
- `$!`: PID del último trabajo en background.
- `shift`: descarta $1 y corre el resto ($2 pasa a $1).
- `set -- a b c`: reconstruye la lista de args desde cero.

## Ejemplo guiado

```bash
$ bash especiales.sh uno dos tres
Tenía 3
tras shift: 2 — ahora dos
exit de false: 1
```

## Tu reto

Con 3 args: imprime `Tenía 3`, después `shift` e imprime `Me quedo con 2: <nuevo $1> <nuevo $2>`, y NO confundir con un `echo "false devolvió 1"` tras un `false`.

## Errores típicos

- Beber de `$?` tras un `echo`: has perdido el código original.
- `shift 4` con menos de 4 args: la lista queda vacía.

## Mini-quiz

¿Qué vale $1 tras `shift 2` con args a b c?

<details><summary>Ver respuesta</summary>

c (descarta los dos primeros args).

</details>

---

*~8 min · Nivel 1 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
