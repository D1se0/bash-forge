# while con acumulador: sumar y contar en el bucle

> **Objetivo:** Acumular resultados dentro de while sin perderlos al salir.

## Teoría

El bucle acumula: variables vivas ANTES del while sobreviven al salir…
SALVO que metas el bucle en una pipe (`cat | while`): esas vueltas corren
en subshell y el total se pierde. Leo fichero con redir < fichero.

```bash
total=0
while IFS= read -r n; do
  total=$((total + n))
done < numeros.txt
echo "$total"
```

## Ejemplo guiado

```bash
# numeros.txt contiene 10, 20 y 30 (uno por línea)
$ bash sumador.sh
total: 60
```

## Tu reto

Crea `numeros.txt` con los números 10, 20 y 30 (un número por línea) y
`sumador.sh` que los sume e imprima `total: 60`. El script debe funcionar
con cualquier `numeros.txt` similar.

## Errores típicos

- `cat numeros.txt | while …` total=0 después: la pipe crea subshell y borra el total.
- [object Object]

## Mini-quiz

¿Por qué el total muere si el while va tras una pipe?

<details><summary>Ver respuesta</summary>

Cada parte de una pipe corre en subshell: las variables sólo existen dentro.

</details>

---

*~8 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
