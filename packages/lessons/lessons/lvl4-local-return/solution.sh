#!/usr/bin/env bash
cuenta() {
  local i s=0
  for i in $(seq 1 "$1"); do
    s=$((s+i))
  done
  echo "$s"
}
total=$(cuenta "$1")
echo "total: $total"
