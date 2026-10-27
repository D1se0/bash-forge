#!/usr/bin/env bash
# Lint del repo: shellcheck bash + lint-lessons + typecheck de workspaces.
set -uo pipefail
cd "$(dirname "$0")/.."
fail=0

if command -v shellcheck >/dev/null 2>&1; then
  echo "· shellcheck"
  shellcheck -x bin/bashforge install.sh packages/lessons/completions/bashforge.bash || fail=1
else
  echo "· shellcheck no está instalado; se omite (apt install shellcheck)"
fi

echo "· lint-lessons"
(cd packages/lessons && node tools/lint-lessons.mjs) || fail=1

echo "· contraste AA de tokens"
node scripts/contrast-check.mjs || fail=1

for ws in packages/shared apps/sandbox-server apps/web; do
  echo "· typecheck $ws"
  (cd "$ws" && npx tsc --noEmit -p tsconfig.json) || fail=1
done

if [ "$fail" -eq 0 ]; then echo "✔ lint completo en verde"; else echo "✖ lint con fallos"; fi
exit "$fail"
