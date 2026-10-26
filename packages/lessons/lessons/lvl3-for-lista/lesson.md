# for sobre listas: la máquina de rodajas

> **Objetivo:** Iterar listas con for clásico y contar con un índice.

## Teoría

El `for` Bash itera LISTAS de palabras:

```bash
for item in mahogany roble haya; do echo $item; done
```

También sobre ficheros con glob: `for f in *.sh; do …; done`. Cuidado: palabras con espacios se rompen sin comillas — para iterar argumentos usa siempre `"$@"`.

## Ejemplo guiado

```bash
$ for metal in cobre estaño zinc; do echo "Derrito: $metal"; done
Derrito: cobre
Derrito: estaño
Derrito: zinc
```

## Tu reto

Crea `listado.sh` que reciba 3 argumentos e imprima por cada uno `piezas N: <arg>` empezando por N=1:
`bash listado.sh alfa beta gamma` debe dar 3 líneas en orden.

## Errores típicos

- Usar `{{` llaves de otros lenguajes; en Bash el bloque son `done`…
- [object Object]

## Mini-quiz

¿Qué diferencia hay entre `for f in *.txt` y `for f in "$@"`?

<details><summary>Ver respuesta</summary>

El primero itera ficheros del glob; el segundo los argumentos recibidos (por cada pieza, con espacios intactos).

</details>

---

*~7 min · Nivel 3 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
