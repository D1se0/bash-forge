Primera pista

`[[ -d $1 ]]` antes que `[[ -f $1 ]]`: el orden DECIDE.
---
Segunda pista

`[[ -s $1 ]]` es «no vacío»; vacío es `! -s`.
---
Tercera pista

El fantasma es el else final.