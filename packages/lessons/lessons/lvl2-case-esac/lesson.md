# case: mascarillas y cadenas completas

> **Objetivo:** Femuscular decisiones con case, patrones y sus ;;&.

## Teoría

`case` seleccione una rama entre muchas por patrón:

```bash
case $1 in
  start)     echo "we initiate" ;;
  stop)      echo "shutdown" ;;
  reset|cr)  echo "restore" ;;
  *)         echo "no supe: $1" ;;
esac
```

Cierre de rama: `;;` (termina). `;&` SIGUE con la siguiente rama (caída). `;;&` busca más patrones compatibles. Patrones: globs (`s*`, `[0-9]`).

## Ejemplo guiado

```bash
$ bash mascarilla.sh reset
restore
$ bash mascarilla.sh ay
no supe: ay
```

## Tu reto

Crea `mascarilla.sh` que decidas:
- "start|iniciar` → `Arrancar"
- "stop|apagar` → `Detener"
- `restart` → `Arrancar` y `Detener` AMBOS (en orden Detener luego Arrancar; usa ;;&)
- otra → `Soplo?`

## Errores típicos

- Olvidar `;;` al final de cada rama abre el parseo infernal.
- `*)` sin comodín último (comodín catch-all ausente) hace que case NO vaya al else.

## Mini-quiz

Casi todo el mundo pregunta: ¿qué hacen ;;& y ;& ?

<details><summary>Ver respuesta</summary>

;& continúa con el cuerpo inmediatamente siguiente; ;;& salta a probar más patrones y ejecuta si hacen match.

</details>

---

*~8 min · Nivel 2 (Ayudante de herrero) · pulsa **Comprobar** cuando lo tengas.*
