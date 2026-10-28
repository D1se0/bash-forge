# cut: trocear por columna o delimitador

> **Objetivo:** Extraer columnas de CSVs y posiciones de carácteres.

## Teoría

`cut -f2 -d','` toma el CAMPO 2 separado por comas; `cut -c1-4` toma los CARÁCTERES del 1 al 4.

## Tu reto

Se creó `datos.csv` con formato nombre,edad,ciudad. Crea `columna.sh` que imprima SOLO las edades.

## Errores típicos

- Confundir -d con el delimitador por defecto (tabulación): SIEMPRE especifíca -d en CSVs.

---

*~9 min · Nivel 6 (Herrero de élite) · pulsa **Comprobar** cuando lo tengas.*
