# WHILE: bucle con condición

> **Objetivo:** while con condición aritmética y actualización manual.

## Teoría

El while repite mientras su condición sea cierta; alguien debe
actualizar el dato para que acabe:

```bash
n=3
while [ "$n" -gt 0 ]; do
  echo "t-$n"
  n=$((n - 1))
done
```

Si olvidas decrementar, el bucle es infinito (Ctrl-C para pararlo).

## Ejemplo guiado

```bash
$ bash cuenta-atras.sh
t-3
t-2
t-1
```

## Tu reto

Crea `cuenta-atras.sh` que imprima `t-3`, `t-2`, `t-1` y al final
`lanzar`, con while (no con for).

## Errores típicos

- Bucle infinito: sin `n=$((n-1))` el while nunca termina.
- Falta el `lanzar` final: imprime al terminar el while, no dentro.

---

*~5 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
