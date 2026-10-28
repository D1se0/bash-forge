Primera pista

`for i in $(seq 1 $N); do for j …; done; done` y la regla de corte AFUERA del for interior.
---
Segunda pista

Tras terminar una fila con $i == 3, `break 2` corta los DOS bucles: nada de d4.
---
Tercera pista

Si N <= 3 el corte no dispara y el cuadrado queda entero.