# CASE: patrones con comodines

> **Objetivo:** case con *.ext, rangos y alternancias de patrones.

## Teoría

Los patrones de case son globs (no regex):

```bash
case "$f" in
  *.sh)  echo "guion" ;;
  *.txt) echo "texto" ;;
  readme?) echo "doc corto" ;;
  *)  echo "otro" ;;
esac
```

`*` casa cualquier cadena (incluida vacía), `?` un carácter.
Para alternar: `a|b|c)`.

## Ejemplo guiado

```bash
$ bash extension.sh script.sh
guion
$ bash extension.sh notas.txt
texto
$ bash extension.sh foto.png
otro
```

## Tu reto

Crea `extension.sh` que clasifique por extensión: `.sh` → `guion`,
`.txt` → `texto`, `.png` → `imagen` y lo demás → `otro`.

## Errores típicos

- `case $f in` sin comillas: ficheros con espacios rompen: `"$f"` siempre.
- Usar regex `\\.sh$` en case: sólo globs; el punto ya es un punto literal en `*.sh`.

---

*~6 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
