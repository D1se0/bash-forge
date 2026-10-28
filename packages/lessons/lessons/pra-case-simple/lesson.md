# CASE: clasificar un valor

> **Objetivo:** case con patrones exactos y comodín default.

## Teoría

El case elige la primera rama que encaja con el patrón:

```bash
case "$1" in
  rojo)  echo "caliente" ;;
  azul)  echo "frío" ;;
  *)     echo "desconocido" ;;
esac
```

`*` es «cualquier cosa»: el default, SIEMPRE al final.

## Ejemplo guiado

```bash
$ bash clasifica.sh rojo
caliente
$ bash clasifica.sh verde
desconocido
```

## Tu reto

Crea `clasifica.sh` que clasifique colores: `rojo` → `caliente`,
`azul` → `frío` y cualquier otra cosa → `desconocido`.

## Errores típicos

- `*)` en medio: entonces casi todo cae ahí y las ramas de debajo son tinta muerta.
- Olvidar el `;;` de cierre de rama: error de sintaxis.

---

*~5 min · Nivel 9 (Maestro Forjador) · pulsa **Comprobar** cuando lo tengas.*
