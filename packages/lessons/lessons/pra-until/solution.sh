cat > adivina.sh <<'EOF'
#!/usr/bin/env bash
n=1
until [ "$n" -eq 3 ]; do
  echo "intento $n"
  n=$((n + 1))
done
echo "acertado en $n"
EOF
bash adivina.sh
