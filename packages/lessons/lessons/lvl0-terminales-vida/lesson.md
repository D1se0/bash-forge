# Sobrevivir a la terminal: Ctrl+C, Ctrl+D e historial

> **Objetivo:** Controlar teclas críticas, cancelar procesos y usar el historial.

## Teoría

Tres atajos de supervivencia:

- **Ctrl+C**: envía SIGINT y mata lo que corre en primer plano.
- **Ctrl+D**: EOF en stdin. En tu shell, sale de la sesión; en `cat`, finaliza la entrada.
- **↑/↓**: historial. `history` lista; `!34` re-ejecuta la 34ª; `!!` la última.

Y `$?` te pinta el código de salida del comando anterior (Bash Forge lo en el prompt).

## Ejemplo guiado

```bash
$ sleep 100
^C                  # Ctrl+C lo mata
$ history | tail -3
```

## Tu reto

Guarda las últimas 2 líneas de `history` en `mi-historial.txt`. Suficiente: el resto es práctica libre (matando comandos colgados con Ctrl+C, ¡cuidado con `sleep 999`!).

## Errores típicos

- El `history` solo lo tiene la shell INTERACTIVA: dentro de un script no hay.
- `history -1` no existe; usa `tail -N`.

## Mini-quiz

¿Qué hace `!99`?

<details><summary>Ver respuesta</summary>

Re-ejecuta la orden número 99 del historial (¡no la última!).

</details>

---

*~5 min · Nivel 0 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
