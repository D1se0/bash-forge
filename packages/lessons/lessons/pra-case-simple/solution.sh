cat > clasifica.sh <<'EOF'
#!/usr/bin/env bash
case "$1" in
  rojo) echo "caliente" ;;
  azul) echo "frío" ;;
  *) echo "desconocido" ;;
esac
EOF
bash clasifica.sh rojo; bash clasifica.sh azul
