# FOR estilo C: for ((i=0; i<N; i++))

> **Objetivo:** Contar iteraciones fijas con for (( )).

## Teoría

Para repetir N veces, el for con doble paréntesis cuenta solo:

```bash
for ((i=1; i<=3; i++)); do
  echo "vuelta $i"
done
```

También sirve para saltos: `for ((i=10; i>0; i-=2))`.

## Ejemplo guiado

```bash
$ bash tabla.sh
tabla-note 1
tabla-note 2
tabla-note 3
```

## Tu reto

Crea `tabla.sh` que imprima `tabla-note N` para N = 1, 2 y 3 (en ese
orden) usando `for ((...))`, sin lista literal.

## Errores típicos

- `for ((i=1; i<=3; i++))` con un solo paréntesis: error de sintaxis.
- Usar variables `$i` dentro de `(())`: los paréntesis aritméticos no llevan $.

---

*~6 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
