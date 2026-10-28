cat > enrutador.sh <<'EOF'
#!/usr/bin/env bash
n=1
for orden in "$@"; do
  case "$orden" in
    subir) echo "ronda $n: SUBE" ;;
    bajar) echo "ronda $n: BAJA" ;;
    parar) echo "ronda $n: PARAR"; break ;;
    *)     echo "ronda $n: ???" ;;
  esac
  n=$((n + 1))
done
EOF
