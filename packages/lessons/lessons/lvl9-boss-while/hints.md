Primera pista

while IFS= read -r l; do case … esac; done < manifiesto.txt
---
Segunda pista

Los comentarios: `case "$l" in \#*) continue;; esac` antes de sumar.
---
Tercera pista

`stop` → break; `subir N` → rumbo=$((rumbo + ${l#subir })) (quitó el prefijo).