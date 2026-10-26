# Boss Fight · El Motor de Fragutos

> **Objetivo:** Gran examen de bucles: listas, ficheros, condicionales y saltos.

## Teoría

Un boss de loops con tres pruebas ligeras:
1. Tu motor se ejecuta sin línea y lee un fichero de consignas.
2. Control de flujo: for con los datos del fichero.
3. No rompers ante contenido variado: líneas con espacios, vacías y difíciles.

## Tu reto

Prepara el reto: crea un fichero `tareas.txt` con estas tres líneas EXACTAS:
```
comprar hierro barato
cerrar fragua
tocar campana
```
Y crea `motor.sh` que las lea línea a línea, saltando cualquier línea que empieza por `#` (comments), e imprima por cada una `motor: <línea>`.

## Errores típicos

- Ignorar el fichero de datos: la prueba requiere el while-read con archivo.
- [object Object]

---

*~15 min · Nivel 3 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
