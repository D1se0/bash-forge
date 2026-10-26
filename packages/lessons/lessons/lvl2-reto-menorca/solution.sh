#!/usr/bin/env bash
if (( $1 < $2 )); then
  echo "menor: $1"
elif (( $1 > $2 )); then
  echo "menor: $2"
else
  echo "iguales"
fi
