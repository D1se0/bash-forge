#!/usr/bin/env bash
echo "Recibidas $# piezas"
n=1
for arg in "$@"; do echo "Pieza $n → $arg"; n=$((n+1)); done
