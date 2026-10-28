# IF: cadena if / elif / else

> **Objetivo:** Encadenar condiciones con elif y cubrir todos los rangos.

## Teoría

Cuando hay varios caminos, el `elif` encadena y el `else` cierra:

```bash
if   [ "$n" -lt 10 ]; then echo "bajo"
elif [ "$n" -lt 100 ]; then echo "medio"
else echo "alto"
fi
```

El elif sólo se evalúa si los anteriores fallaron: el orden importa.

## Ejemplo guiado

```bash
$ bash rango.sh 5
bajo
$ bash rango.sh 50
medio
$ bash rango.sh 500
alto
```

## Tu reto

Crea `rango.sh` que reciba un número y clasifique: `bajo` si es menor
que 10, `medio` si es menor que 100 (y 10 o más) y `alto` si es
100 o más. Usa if / elif / else, no tres if sueltos.

## Errores típicos

- `[ $n -lt 10 ]` con n vacío: error de test; valida con `${1:-0}`.
- Usar dos `if` independientes en vez de elif: 150 imprimiría dos líneas.

---

*~6 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
