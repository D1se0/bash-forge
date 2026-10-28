# Reto · La fila de la forja

> **Objetivo:** While + case + contador al servicio de una fila con prioridades.

## Teoría

Teoría de cola: atiendes quién entra, en orden, y decides quién ya salió.
Este reto se resuelve sin sort ni awk: solo bucles, case y variables.

```bash
# tus herramientas: variables, bucles, case, break/continue y $(( )) aritmética
```

## Ejemplo guiado

```bash
$ bash fila.sh 3 1 2
atendido 1
atendido 2
atendido 3
```

## Tu reto

Crea `fila.sh`: procesa los argumentos en orden (las opciones suelen
venir primero) y por cada número imprime `atiende N`. Dos opciones:
"-"         → cierra la fila: todo lo que venga después NO se atiende.
"--repe"    → activa el antirepes: un número que ya salió no sale otra vez.

## Errores típicos

- No ignorar lo que venga tras `-`: cierra la fila para SIEMPRE, lo posterior se descarta.
- Contar erroneamente las opciones: `--repe` y `-` NO son números que se atienden.

## Mini-quiz

¿Dónde guardo el «ya atendí N»?

<details><summary>Ver respuesta</summary>

Una variable cadena acumulando (o un array): memoriza lo que ya salió.

</details>

---

*~12 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
