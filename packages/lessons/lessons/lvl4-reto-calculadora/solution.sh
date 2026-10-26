#!/usr/bin/env bash
case "$2" in
  +) echo $(( $1 + $3 )) ;;
  -) echo $(( $1 - $3 )) ;;
  x) echo $(( $1 * $3 )) ;;
  /)
    if (( $3 == 0 )); then
      echo "no dividir cero"
      exit 1
    fi
    echo $(( $1 / $3 ))
    ;;
esac
