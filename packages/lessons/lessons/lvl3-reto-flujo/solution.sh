#!/usr/bin/env bash
n="$1"
voz=0
[[ "${2:-}" == "--voz" ]] && voz=1
for (( i = n; i >= 1; i-- )); do
  echo "pulso $i"
  if (( voz )); then echo "¡COMANDO RECIBIDO!"; fi
done
echo "grácolo fin"
