# if / elif / else: la decisión básica

> **Objetivo:** Escribir un if correcto con test y entender el exit code como verdad.

## Teoría

En Bash **el exit code decide**: 0 = verdadero. Un `if` sale por ahí:

```bash
if cmd; then
  …        # exit 0
elif otra; then
  …
else
  …
fi
```

`test expr` y su atajo `[ expr ]` devuelven 0/1 según la expresión. `[[ ]]` (Bash puro) es más guay: sin splitting, `=~` regex, y `&&/||` dentro. ¿La regla de oro? `[[ ]]` para todo moderno.

## Ejemplo guiado

```bash
$ edad=18
$ if [ "$edad" -ge 18 ]; then echo adulto; fi
adulto
```

## Tu reto

Crea `decision.sh` que lea un número como $1:
- Si es ≥ 10: `Cifras: al menos dos`
- Si es < 10: `Cifras: solo una`

## Errores típicos

- `[ $edad -ge 18 ]` sin comillas falla si edad está vacía: usa `[[ ]]` o comillas.
- Poner `then` al final de un `if` con punto y coma en otra línea: el `fi` cierra, pero un `then` perdido rompe el parseo.

## Mini-quiz

¿Qué devuelve un `if` cuando su condición es falsa y hay else?

<details><summary>Ver respuesta</summary>

Se ejecuta el bloque else; el exit code es el del último comando ejecutado (el else).

</details>

---

*~7 min · Nivel 2 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
