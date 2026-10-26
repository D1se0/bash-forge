# El shebang: #!/usr/bin/env bash

> **Objetivo:** Marca un script como ejecutable y entiende la primera línea.

## Teoría

La primera línea de un script Bash profesional es el **shebang**: `#!/usr/bin/env bash`. Al ejecutarlo directamente, el kernel lee esa línea y lanza el intérprete correcto (`env` localiza bash en el PATH).

Sin bit `x` el sistema no puede ejecutarlo: se da con `chmod +x script.sh` (compruébalo con `ls -l`: verás `-rwx…`).

## Ejemplo guiado

```bash
$ nano hello.sh
#!/usr/bin/env bash
echo "Hola, herrero"
$ chmod +x hello.sh
$ ./hello.sh
Hola, herrero
```

## Tu reto

Crea `hello.sh` con shebang que imprima `Hola desde Bash Forge`; dale `chmod +x` y ejecútalo.

## Errores típicos

- Shebang precedido por BOM o espacios: debe ser lo primero del fichero.
- `./hello.sh` con `Permission denied`: falta `chmod +x`.

## Mini-quiz

¿Qué hace el shebang de hecho?

<details><summary>Ver respuesta</summary>

Indica al kernel qué intérprete abrir: bash localizado vía env.

</details>

---

*~7 min · Nivel 0 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
