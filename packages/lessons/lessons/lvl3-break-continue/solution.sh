#!/usr/bin/env bash
for a in "$@"; do
  if [[ "$a" == "STOP" ]]; then break; fi
  if [[ "$a" == -* ]]; then continue; fi
  echo "$a"
done
