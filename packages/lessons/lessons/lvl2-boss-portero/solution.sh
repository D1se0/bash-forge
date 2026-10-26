#!/usr/bin/env bash
if [[ ! -e $2 ]]; then
  echo "NO"
elif [[ -d $2 ]]; then
  echo "DIR"
elif [[ -s $2 ]]; then
  echo "FICHERO"
else
  echo "VACIO"
fi
