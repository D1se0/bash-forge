Primera pista

while getopts "n:fh" opt; do … case. "n:" espera un arg → OPTARG.
---
Segunda pista

Solo getopts cae en $1 ya procesado; recuerda shift $((OPTIND-1)).
---
Tercera pista

Imprimen separadas cada dato a medida de la flag que se recibió (dos opciones → dos líneas).