cat > sello.sh <<'EOF'
#!/usr/bin/env bash
if [ -n "$1" ]; then
  echo "Sello: $1"
elif [ -n "${ROTULO+x}" ]; then
  echo "Sello: $ROTULO"
else
  echo "Sello: sin marca"
fi
EOF
bash sello.sh
bash sello.sh venta
