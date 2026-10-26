Primera pista

`echo "Tenía $#"` → `shift` → `echo "Me quedo con $#: $1 $2"`.
---
Segunda pista

Conserva `$#` en una variable ANTES del shift si lo necesitas luego.
---
Tercera pista

`false; echo "false devolvió $?"`