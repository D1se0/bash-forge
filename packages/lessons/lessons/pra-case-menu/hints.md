Primera pista

`while read -r op; do case "$op" in hola) …;; salir) echo adiós; break;; esac; done`
---
Segunda pista

Ignorar lo desconocido: sin rama de cierre, el while sigue esperando la próxima línea.