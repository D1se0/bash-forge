#!/usr/bin/env bash
if [ -d "$1" ]; then
  echo "CARPETA"
elif [ ! -s "$1" ] && [ -f "$1" ]; then
  echo "PAPEL EN BLANCO"
elif [ -s "$1" ]; then
  echo "FICHERO"
else
  echo "FANTASMA"
fi
