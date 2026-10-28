# UNTIL: repetir hasta que pase algo

> **Objetivo:** until como contrario de while (repite hasta acertar).

## Teoría

`until` es un while al revés: repite HASTA que su condición sea
verdadera.

```bash
intento=0
until [ "$intento" -eq 3 ]; do
  intento=$((intento + 1))
done
echo "acertado en $intento"
```

Da igual que empecemos con la condición falsa: entra al menos una vez.

## Ejemplo guiado

```bash
$ bash adivina.sh
intento 1
intento 2
acertado en 3
```

## Tu reto

Crea `adivina.sh` que intente adivinar el número 3: imprima `intento N`
por cada ronda hasta que N sea 3, y al final `acertado en 3`.
Usa `until` (no while negando la condición).

## Errores típicos

- Usar `while [ $n -ne 3 ]` en vez de until: lógicamente funciona, pero la gracia de until es leer «hasta que n esté en 3».
- Olvidar `n=$((n+1))`: bucle infinito.

---

*~6 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
