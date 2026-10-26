#!/usr/bin/env bash
n="$1"
if (( n % 2 == 0 )); then
  echo "PAR"
else
  echo "IMPAR"
fi
