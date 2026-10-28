Primera pista

`n=1; until (( n > $1 )); do echo "caja $n"; ((n++)); done`
---
Segunda pista

Si nadie pasa $1, default `until (( n > ${1:-0} ))` no imprime nada.