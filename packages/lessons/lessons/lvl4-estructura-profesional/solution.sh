#!/usr/bin/env bash
readonly VERSION="1.0"
saluda() {
  echo "Beatriz saluda: versión $VERSION"
}
main() {
  saluda
}
main "$@"
