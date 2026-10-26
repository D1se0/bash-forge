#!/usr/bin/env bash
case "$1" in
  start|iniciar)
    echo "Arrancar" ;;
  stop|apagar)
    echo "Detener" ;;
  restart)
    echo "Detener"
    echo "Arrancar" ;;
  *)
    echo "Soplo?" ;;
esac
