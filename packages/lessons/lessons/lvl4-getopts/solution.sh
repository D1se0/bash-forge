#!/usr/bin/env bash
while getopts "n:f" opt; do
  case $opt in
    n) echo "nombre: $OPTARG" ;;
    f) echo "furia: sí" ;;
  esac
done
