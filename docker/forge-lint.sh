#!/usr/bin/env bash
# ==============================================================
# forge-lint <script.sh> [script2.sh …]
# Linter estilo VS Code para tus scripts: shellcheck con salida
# coloreada y resumida (severidad + línea + mensaje).
# Sin argumentos: lintea todos los *.sh de tu home.
# ==============================================================
set -uo pipefail

if ! command -v shellcheck >/dev/null 2>&1; then
  echo "forge-lint: shellcheck no está instalado en esta imagen" >&2
  exit 2
fi

if [ $# -gt 0 ]; then
  TARGETS=("$@")
else
  shopt -s nullglob
  TARGETS=("$HOME"/*.sh)
fi

if [ ${#TARGETS[@]} -eq 0 ] || [ -z "${TARGETS[0]}" ]; then
  echo "forge-lint: no hay scripts que lintear (crea un .sh primero)"
  exit 0
fi

total=0
for f in "${TARGETS[@]}"; do
  [ -f "$f" ] || { echo "forge-lint: no existe $f" >&2; continue; }
  echo "── $f ──"
  if shellcheck -x --color=always --severity=info "$f"; then
    echo "   ✓ sin problemas"
  else
    total=$((total + 1))
  fi
done

if [ "$total" -gt 0 ]; then
  echo "forge-lint: $total script(s) con avisos (línea roja = error, amarilla = aviso)"
  exit 1
fi
echo "forge-lint: todo bien ✓"
