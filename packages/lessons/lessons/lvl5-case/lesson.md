# case con comodines * y ?

> **Objetivo:** Repasar la primera vez case de nivel 1 y hacer matching con glob completo.

## Teoría

Uso de `?` para un solo carácter (exactamente uno), `*` para any amount of chars (0 o más). case detiene en la primera rama que matchea.

## Tu reto

Crea `figura.sh` que reciba $1 y diga el tipo:
- "`3 lados: triángulo.`"
- "`4 lados: cuadrilátero.`"
- "cualquier otro número: otra."

## Errores típicos

- Usar * sin ;;
- Olvidar la condición default *) para TODO lo que no matcheó antes.

---

*~8 min · Nivel 5 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
