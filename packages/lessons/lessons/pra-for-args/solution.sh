cat > pasa-por-agua.sh <<'EOF'
#!/usr/bin/env bash
for arg in "$@"; do
  echo "arg: $arg"
done
echo "total: $#"
EOF
bash pasa-por-agua.sh hola "dos palabras"
