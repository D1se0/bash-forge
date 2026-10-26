printf 'entrada primera\nentrada segunda\n' > notas.csv
cat > lector.sh <<'EOF'
#!/usr/bin/env bash
while IFS= read -r l; do
  echo "ley: $l"
done < notas.csv
EOF
bash lector.sh
