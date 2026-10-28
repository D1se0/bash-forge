cat > cuenta-atras.sh <<'EOF'
#!/usr/bin/env bash
n=3
while [ "$n" -gt 0 ]; do
  echo "t-$n"
  n=$((n - 1))
done
echo "lanzar"
EOF
bash cuenta-atras.sh
