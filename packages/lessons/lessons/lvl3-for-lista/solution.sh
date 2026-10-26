#!/usr/bin/env bash
n=1
for a in "$@"; do
  echo "piezas $n: $a"
  n=$((n+1))
done
