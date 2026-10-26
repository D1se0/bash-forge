# Subshells y ámbito

> **Objetivo:** Gestionado por encerrado en () vs {}.

## Teoría

`( cmd )` crea un subshell y las var de dentro NO salen fuera. `{ cmd; }` es un grupo, ejecuta en el shell actual.

## Tu reto

Crea `ambito.sh` que ponga `x=interior` dentro de un `( )` y despues muestre `$x` desde fuera, quedando vacío: imprime `fuera: `.

## Errores típicos

- [object Object]

---

*~10 min · Nivel 7 (Herrero de élite) · pulsa **Comprobar** cuando lo tengas.*
