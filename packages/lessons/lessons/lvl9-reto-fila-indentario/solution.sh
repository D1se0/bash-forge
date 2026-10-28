cat > fila.sh <<'EOF'
#!/usr/bin/env bash
cerrada=0
antirepes=0
vistos=" "
for a in "$@"; do
  case "$a" in
    --repe)  antirepes=1; continue ;;
    -)       cerrada=1; continue ;;
  esac
  (( cerrada )) && continue
  if (( antirepes )); then
    case "$vistos" in
      *" $a "*) continue ;;
    esac
  fi
  echo "atiende $a"
  vistos="$vistos $a "
done
EOF
