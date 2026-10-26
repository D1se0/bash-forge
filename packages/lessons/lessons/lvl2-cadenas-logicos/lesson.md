# Cadenas y lógica: -z -n, = !=, =~ y ! && ||

> **Objetivo:** Comparar cadenas vacías, iguales, por regex y combinar condiciones.

## Teoría

Con `[[ ]]`:

- `-z x`: vacía · `-n x`: no vacía
- `x = "y"` or `x == "y"`: iguales · `x != "y"`: distintas
- `x == a*`: casar con globs (a, abc…)
- `x =~ ^[0-9]+$`: regex
- Lógica: `!`, `&&`, `||` UNIDOS: `[[ -n $x && $x =~ ^[0-9]+$ ]]`

## Ejemplo guiado

```bash
$ x=""
$ [[ -z $x ]] && echo vacia
vacia
$ [[ 42 =~ ^[0-9]+$ ]] && echo numero
numero
$ [[ tarro == ta* ]] && echo glob
glob
```

## Tu reto

Crea `cadenas.sh` con $1:
- vacío → `VACIO`
- solo dígitos → `DIGITOS`
- otra cosa → `OTRO`

## Errores típicos

- `[[ $1 =~ "\\d+" ]]`: en bash `=~` usa ERE con \\d NO estándar; usa [0-9].
- Usar `<`/`>` de cadenas dentro de `[ ]` clásico: ambiguas con redirecciones.

## Mini-quiz

¿`-z` y `-n` se excluyen mutuamente?

<details><summary>Ver respuesta</summary>

Sí, para una misma cadena: -z cierta cuando -n es falsa y viceversa.

</details>

---

*~7 min · Nivel 2 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
