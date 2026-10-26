#!/usr/bin/env bash
if [[ -z "${1:-}" ]]; then
  echo "VACIO"
elif [[ "$1" =~ ^[0-9]+$ ]]; then
  echo "DIGITOS"
else
  echo "OTRO"
fi
