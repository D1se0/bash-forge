# IF: ¿existe el fichero?

> **Objetivo:** Escribir un `if` con `[ -f ]` y su rama `else`.

## Teoría

El `if` pregunta con un comando; `[ ... ]` es ese comando:

```bash
if [ -f "$1" ]; then
  echo "existe"
else
  echo "no existe"
fi
```

Tests útiles: `-f` fichero regular, `-d` directorio, `-z` cadena vacía,
`-x` ejecutable. SIEMPRE entre comillas: `[ -f "$f" ]`.

## Ejemplo guiado

```bash
$ bash checa.sh /etc/hostname
existe
$ bash checa.sh /no/existe
no existe
```

## Tu reto

Crea `checa.sh` que reciba una ruta como $1 e imprima `existe` cuando
sea un fichero regular y `no existe` en cualquier otro caso.

## Errores típicos

- Escribir `if [ -f $1 ]` sin comillas: rutas con espacios rompen el test.
- Olvidar el `fi`: bash avisa «unexpected end of file».

---

*~5 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
