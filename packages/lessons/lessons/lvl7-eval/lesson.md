# eval y sus peligros

> **Objetivo:** Entender cuándo vale la pena y cuando es una trampa.

## Teoría

`eval "comando"` vuelve a pasar la línea por el parser. Sirve para ejecutar comandos compuestos cuando guardas el texto.

## Tu reto

Crea `señal.sh` que construya el texto `echo ejecutado por eval` y luego lo ejecute con eval.

## Errores típicos

- eval con input del usuario: el código puede inyectar lo que sea. Solo usa eval sobre texto de confianza.

---

*~10 min · Nivel 7 (Herrero de élite) · pulsa **Comprobar** cuando lo tengas.*
