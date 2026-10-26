# Variables: crear, usar y proteger

> **Objetivo:** Asignar variables sin espacios, leerlas con $ y congelarlas con readonly.

## Teoría

Una variable es un nombre que guarda texto: `nombre=Alicia` (**sin espacios** alrededor del `=`) y se lee con `$nombre` o `${nombre}`. Las comillas dobles expanden; las simples, no.

`readonly` congela la variable (revalorar falla como ERROR). `unset` borra.

## Ejemplo guiado

```bash
$ metal=cobre
$ echo "Fundimos $metal"
Fundimos cobre
$ metal=oro
bash: metal: readonly variable   # si la habrás congelado con readonly
```

## Tu reto

Escribe `vars.sh` que defina `herramienta=Bash` y `version=5`, marque `readonly version`, e imprima exactamente `Mi herramienta es Bash, versión 5`.

## Errores típicos

- `herramienta = Bash` con espacios: Bash piensa que estás ejecutando el comando `herramienta`.
- Olvidar `readonly` delante del nombre: la primera asignación no requiere nada más.

## Mini-quiz

¿Qué imprime `echo '$alerta'` si alerta = FUEGO?

<details><summary>Ver respuesta</summary>

`$alerta`: las comillas simples evitan la expansión.

</details>

---

*~6 min · Nivel 1 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
