# read: preguntar al usuario (y secretos)

> **Objetivo:** Leer teclado con -p, ocultar con -s, limitar con -n, -t.

## Teoría

`read var` lee una línea de stdin. Banderas:

- `-p "prompt"`: pregunta en una línea.
- `-s`: silencio (contraseñas).
- `-n 3`: corto con 3 pulsaciones.
- `-t 5`: timeout de 5 s (falla con exit ≠ 0 si nadie responde).
- `read -ra arr <<< "a b c"` trocea en un array.

Nota: `read` devuelve 0 si leyó, ≠ 0 si EOF o timeout.

## Ejemplo guiado

```bash
$ read -rp "¿Orgullo? " org
¿Orgullo? mucho
$ read -sp "PIN: " pin
PIN:        # oculto
```

## Tu reto

Crea `pregunta.sh` que pregunte `¿Nombre? ` y responda `Ahora te llamas <nombre>`. El test lo llama con `printf 'Iris\n' | bash pregunta.sh`.

## Errores típicos

- Saltar la comilla del mensaje y usar echo para el prompt: se pinta en stdout CON pipa y COUNTA (sirve para el test).
- Usar la variable sin comillas: `echo Te llamo $nombre` rompe si entra con espacios.

## Mini-quiz

`read` devuelve 1: ¿qué ha pasado?

<details><summary>Ver respuesta</summary>

EOF o timeout: stdin cerrado sin línea (o expiró tu -t).

</details>

---

*~7 min · Nivel 1 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
