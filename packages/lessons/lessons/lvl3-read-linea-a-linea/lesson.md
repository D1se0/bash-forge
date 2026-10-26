# Leer ficheros línea a línea: el IFS= read -r idiomático

> **Objetivo:** Ojo con la forma correcta para leer ficheros sin perder espacios.

## Teoría

El truco UNIVERSAL para leer un fichero:

```bash
while IFS= read -r línea; do
  echo "$línea"
done < notas.csv
```

- `IFS=` evita el trimming de espacios.
- `read -r` no procesa backslashes.
- La redirección `< fichero` baja el fichero a la entrada del while. (Alternativa: pipe con cat pero no es idiomático.)

¿Quieres desguantar al final? `done < <(comando)`: process substitution.

## Ejemplo guiado

```bash
$ cat notas.csv
piedra,haydos
cobre,pesado
$ while IFS= read -r l; do echo "nota: $l"; done < notas.csv
nota: piedra,haydos
nota: cobre,pesado
```

## Tu reto

Crea el fichero `notas.csv` con DOS líneas cualquiera y `lector.sh` que las imprima precedidas por `ley: `. El test te deja crear las tuyas y verifica el formato.

## Errores típicos

- `while read x < file` sin IFS y -r: come espacios y backslashes.
- Leer cabeceras sin uso:rome líneas con solo espacios al final van a pedazos de cero líneas.

## Mini-quiz

¿Por qué `< fichero` en vez de `cat fichero | while`?

<details><summary>Ver respuesta</summary>

Puro estilo: el pipe crea una SUBSHELL donde las variables del while no sobreviven; la redirección es el mismo shell.

</details>

---

*~8 min · Nivel 3 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
