cat > abrecajas.sh <<'EOF'
#!/usr/bin/env bash
n=1
until (( n > ${1:-0} )); do
  echo "caja $n"
  ((n++))
done
EOF
