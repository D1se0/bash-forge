# Reto · Inverción de argumentos

> **Objetivo:** Reimprimir la lista de argumentos al revés.

## Teoría

En un reto no hay teoría nueva: combinas lo aprendido. Tools útiles: `set --` reinstala la lista de argumentos, `shift` consume, y con un `case $2` sabes cuantos hay y puedas reordenar manualmente.

## Tu reto

Crea `reverse.sh` que imprima sus argumentos **en orden inverso**, con formato `rev: <arg>` por línea.  
Verifica con:
```
$ bash reverse.sh a b
rev: b
rev: a
$ bash reverse.sh "a b" c
rev: c
rev: a b
```

## Errores típicos

- Consumir la lista con shift ANTES de saber cuántos hay.
- Dividirse por el orden interno de $@ sin plan.

## Mini-quiz

set -- c b a reconsidera qué?

<details><summary>Ver respuesta</summary>

Reinstala tu lista de args como c, b, a (es decir, al revés).

</details>

---

*~10 min · Nivel 1 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
