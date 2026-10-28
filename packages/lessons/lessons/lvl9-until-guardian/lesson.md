# until: el guardián que espera una condición

> **Objetivo:** Escribir bucles con until sin mutar mientras.

## Teoría

`until cond; do …; done` repite mientras `cond` FALLA (exit ≠ 0) y para
cuando por fin sale bien. Es while al revés: útil para "esperar hasta que".

```bash
n=1
until (( n > 5 )); do echo caja $n; ((n++)); done
```

## Ejemplo guiado

```bash
$ bash abrecajas.sh
caja 1
caja 2
…
caja 5
```

## Tu reto

Con `abrecajas.sh`: `bash abrecajas.sh 3` imprime `caja 1`, `caja 2`,
`caja 3` y para. Usa `until` (no while) para desarrollarlo; con 0 no
imprime ninguna caja y sale 0.

## Errores típicos

- [object Object]
- `((n++))` con set -e: cuando n era 0 antes de incrementar, exit 1 mata el script.

## Mini-quiz

¿Qué imprime `n=0; until (( n > 2 )); do echo hi; ((n++)); done`?

<details><summary>Ver respuesta</summary>

hi tres veces (n=0,1,2); con n=3 la condición ya es cierta.

</details>

---

*~7 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
