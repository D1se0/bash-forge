cat > saluda.sh <<'EOF'
#!/usr/bin/env bash
total=0
for n in ana bel chucho; do
  echo "hola $n"
  total=$((total + 1))
done
echo "saludos: $total"
EOF
bash saluda.sh
