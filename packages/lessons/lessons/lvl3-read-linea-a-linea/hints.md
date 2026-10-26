Primera pista

`while IFS= read -r l; do echo "ley: $l"; done < notas.csv`
---
Segunda pista

Primero crea notas.csv con `printf 'a\\nb\\n' > notas.csv` (¡dos minusculas!).
---
Tercera pista

Comprueba con `bash lector.sh` que sale algo antes de Comprobar.