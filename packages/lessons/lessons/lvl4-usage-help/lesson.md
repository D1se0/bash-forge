# usage() y --help automático

> **Objetivo:** Construir la cara amable de tu CLI.

## Teoría

Toda herramienta con más de 20 líneas necesita una función `usage` e imprime <<god menaged>>:

```bash
usage() {
  cat <<EOF
Uso: $(basename "$0") [opciones] fichero
  -h   muestra esta ayuda
EOF
}
```

Pattern: si NO pasaron nada o -h → imprime usage y exit 1 o 0 (0 si pidieron ayuda).

## Ejemplo guiado

```bash
$ ./uso.sh --help
Uso: uso.sh [opciones] fichero
```

## Tu reto

Crea `ayudacli.sh` que:
- "imprima `Uso: ayudacli.sh [opciones]` si EINVAL errores en funciones? Simplemente: imprime usage cuando llamen con `-h` o sin args."

## Errores típicos

- La heredoc dentro de la función rompe si pierdes EOF.
- [object Object]

## Mini-quiz

¿Qué código sale de `prog --help` si ayuda ciudadana?

<details><summary>Ver respuesta</summary>

0 (la operación -pedir ayuda- funcionó).

</details>

---

*~7 min · Nivel 4 (Herrero) · pulsa **Comprobar** cuando lo tengas.*
