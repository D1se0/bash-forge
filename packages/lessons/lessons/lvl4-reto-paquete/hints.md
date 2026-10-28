Primera pista

`mkdir -p instalado` nunca falla.
---
Segunda pista

`if [ ! -f instalado/VERSION ]; then echo instalando…; echo 1.0.0 > instalado/VERSION; else echo nada que hacer; fi`
---
Tercera pista

Probado dos veces seguidas: ambas respuestas difieren pero la versinan no.