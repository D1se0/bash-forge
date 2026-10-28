# FOR: recorrer una lista

> **Objetivo:** Recorrer una lista literal con comillas intactas.

## Teoría

El for de bash recorre PALABRAS de una lista:

```bash
for nombre in ana bel chucho; do
  echo "hola $nombre"
done
```

Las palabras de la lista pueden llevar espacios si van entre comillas:
`for x in "una palabra" dos; do …`.

## Ejemplo guiado

```bash
$ bash saluda.sh
hola ana
hola bel
hola chucho
```

## Tu reto

Crea `saluda.sh` (sin argumentos) que imprima `hola X` para los nombres
ana, bel y chucho, en ese orden. Al final imprime `saludos: 3`.

## Errores típicos

- Usar `while` innecesario: para una lista fija, `for x in …` es directo.
- Contar mal: imprime el contador FUERA del bucle, no en cada vuelta.

---

*~5 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
