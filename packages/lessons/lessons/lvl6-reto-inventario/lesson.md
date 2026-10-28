# Reto · Mini inventario con grep y cut

> **Objetivo:** Componer múltiples comandos con pipes.

## Teoría

grep para filtrar, cut para columnas, sort para ordenar, uniq -c para contar repetidos.

## Tu reto

Se creó `stock.csv` con formato articulo,cantidad. Crea `inventario.sh` que reciba un artículo e imprima SU cantidad.

## Errores típicos

- Olvidar -d',' en cut: te va a separar por tab por defecto.
- No quitar las cabeceras (headlines): chequear que el CSV tiene cabecera y filtrarla.

---

*~15 min · Nivel 6 (Herrero de élite) · pulsa **Comprobar** cuando lo tengas.*
