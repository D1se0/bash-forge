#!/usr/bin/env bash
case "$1" in
  -e) [[ -e $2 ]] && echo "TEST -e: ok" || echo "TEST -e: no" ;;
  -f) [[ -f $2 ]] && echo "TEST -f: ok" || echo "TEST -f: no" ;;
  -d) [[ -d $2 ]] && echo "TEST -d: ok" || echo "TEST -d: no" ;;
  -s) [[ -s $2 ]] && echo "TEST -s: ok" || echo "TEST -s: no" ;;
  *) echo "TEST $1: desconocido" ;;
esac
