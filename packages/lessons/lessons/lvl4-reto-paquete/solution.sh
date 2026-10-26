#!/usr/bin/env bash
mkdir -p instalado
if [ ! -f instalado/VERSION ]; then
  echo "instalando…"
  echo "1.0.0" > instalado/VERSION
else
  echo "nada que hacer"
fi
