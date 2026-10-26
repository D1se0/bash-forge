cat > secreto.sh <<'EOF'
#!/usr/bin/env bash
read -rsp "PIN: " intent
echo
if [ "$intent" == "$PIN" ]; then
  echo "Acceso concedido"
else
  echo "Acceso denegado"
fi
EOF
