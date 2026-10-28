Primera pista

Guarda el estado: bandera `cerrada=0` y `vistos=' '`: acumula ` "$a" ` tras atender.
---
Segunda pista

case de la vuelta: `--repe` activa antirepes; `-` cierra la fila; Números: filtra y atiende.
---
Tercera pista

Comprobar «ya salió» con cadena: `case "$vistos" in *" $a "*) continue;; esac`.