#!/usr/bin/env bash
# Instala Bash Forge en tu máquina: enlaza bin/bashforge a ~/.local/bin
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$HOME/.local/bin"
chmod +x "$REPO/bin/bashforge"
ln -sf "$REPO/bin/bashforge" "$HOME/.local/bin/bashforge"
command -v docker >/dev/null || { echo "⚠ Necesitas docker y docker compose. Instálalos antes de 'bashforge dev'."; }
echo "✔ bashforge enlazado a ~/.local/bin — prueba: bashforge help"
