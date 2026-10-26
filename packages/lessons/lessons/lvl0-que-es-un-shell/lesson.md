# ¿Qué es un shell y qué es Bash?

> **Objetivo:** Distinguir shell de Bash y guardar tu primer saludo con echo.

## Teoría

La **shell** es el programa que traduce lo que escribes en la terminal a llamadas al sistema. En Linux conviven varias: `sh`, `zsh`, `fish`… y la más famosa: **Bash** (Bourne-Again SHell), compatible con el shell original de Unix.

La terminal es la ventana; la shell es el motor que corre dentro. En Bash Forge tu proceso es un Bash de verdad corriendo en Ubuntu dentro de un contenedor: todo lo que hagas aquí es real.

`echo` imprime texto a la salida estándar (stdout). Es la "impresora" universal de Bash.

## Ejemplo guiado

```bash
$ echo "¡Hola, Bash Forge!"
¡Hola, Bash Forge!
$ echo una palabra suelta
una palabra suelta   # sin comillas, Bash separa por espacios
```

## Tu reto

Crea el fichero `saludo.txt` en tu home con el texto exacto `Hola desde Bash Forge`, usando `echo` y la redirección `>`:

```bash
echo "Hola desde Bash Forge" > saludo.txt
```

## Errores típicos

- Escribir `echo>saludo.txt` pegado: Bash lo interpreta como redirección rara y falla.
- Confundir `>` (crea/sobrescribe) con `>>` (añade al final).

## Mini-quiz

¿Qué hace `echo hola > fichero` si `fichero` ya tenía contenido?

<details><summary>Ver respuesta</summary>

Lo sobrescribe: `>` crea o trunca antes de escribir.

</details>

---

*~5 min · Nivel 0 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
