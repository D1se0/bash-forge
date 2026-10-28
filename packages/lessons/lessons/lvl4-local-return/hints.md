Primera pista

Dentro de cuenta: `local i; local s=0; for i in $(seq 1 "$1"); do s=$((s+i)); done; echo $s`
---
Segunda pista

Archivo: `total=$(cuenta "$1"); echo "total: $total"`. Capturas POR STDOUT.
---
Tercera pista

Ojo: seq está disponible en coreutils.