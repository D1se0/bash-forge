printf 'a\nb\nc\n' > notas.txt
cat > cuenta-lineas.sh <<'EOF'
#!/usr/bin/env bash
n=0
while IFS= read -r linea; do
  n=$((n + 1))
done < "$1"
echo "líneas: $n"
EOF
bash cuenta-lineas.sh notas.txt
