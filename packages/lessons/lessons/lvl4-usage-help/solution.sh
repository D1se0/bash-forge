#!/usr/bin/env bash
usage() {
  echo "Uso: ayudacli.sh [opciones] fichero…"
}
if [ $# -eq 0 ]; then usage; exit 1; fi
case "$1" in
  -h) usage; exit 0 ;;
esac
usage
