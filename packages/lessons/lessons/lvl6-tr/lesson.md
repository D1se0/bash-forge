# tr: clonar, cortar y cambiar carácteres

> **Objetivo:** Convertir a mayúsculas/minúsculas, borrar, condensar.

## Teoría

`tr 'a-z' 'A-Z'` mapea carácteres de un set a otro; `-d` borra los que matchean; `-s` condensa repetidos.

## Tu reto

Crea `transformar.sh` que reciba una palabra y la imprimte en MAYÚSCULAS.

## Errores típicos

- Usar tr sobre un fichero: mejor que leer con `<` o por pipe.
- tr solo funciona por SETS de carácteres, no por cadenas de longitud distinta.

---

*~8 min · Nivel 6 (Herrero de élite) · pulsa **Comprobar** cuando lo tengas.*
