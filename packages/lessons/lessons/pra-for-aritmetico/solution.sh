cat > tabla.sh <<'EOF'
#!/usr/bin/env bash
for ((i = 1; i <= 3; i++)); do
  echo "tabla-note $i"
done
EOF
bash tabla.sh
