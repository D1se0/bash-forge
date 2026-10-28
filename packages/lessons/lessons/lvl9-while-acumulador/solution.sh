printf '10\n20\n30\n' > numeros.txt
cat > sumador.sh <<'EOF'
#!/usr/bin/env bash
total=0
while IFS= read -r n; do
  [[ -z "$n" ]] && continue
  total=$((total + n))
done < numeros.txt
echo "total: $total"
EOF
