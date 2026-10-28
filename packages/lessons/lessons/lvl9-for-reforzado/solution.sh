cat > alimentador.sh <<'EOF'
#!/usr/bin/env bash
for a in "$@"; do
  echo "voc: $a"
done
echo "vocadas: $#"
EOF
bash alimentador.sh hola "dos palabras" fin
