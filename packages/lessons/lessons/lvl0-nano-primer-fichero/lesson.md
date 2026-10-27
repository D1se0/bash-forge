# Tu editor: guardar y salir con nano

> **Objetivo:** Crear y guardar ficheros con nano sin quedar atrapado.

## Teoría

**nano** es el editor de bienvenida: escribes literalmente y en la barra inferior hay ayudas. Guardar = `Ctrl+O` (Write Out), Enter para confirmar. Salir = `Ctrl+X`. Buscar = `Ctrl+W`. `Ctrl+K` corta la línea actual (y `Ctrl+U` la pega).

## Ejemplo guiado

```bash
$ nano notas.md
… escribes, Ctrl+O Enter guarda, Ctrl+X sale …
$ cat notas.md
Nota: uso Ctrl+O para guardar
Nota: uso Ctrl+X para salir
```

## Tu reto

Abre `nano notas.md` y deja **dos líneas** que empiecen por la palabra `Nota:` (por ejemplo, `Nota: uso Ctrl+O para guardar`). Guarda y sal sin error.

## Errores típicos

- Con nano, Ctrl+T lanza el linter de la forja (shellcheck) sobre el fichero.
- Guardar dos veces y acabar con `notas.md.md`.

## Mini-quiz

En nano, ¿qué combinación guarda sin salir?

<details><summary>Ver respuesta</summary>

Ctrl+O (Write Out) más Enter.

</details>

---

*~8 min · Nivel 0 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
