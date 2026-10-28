cat > duelo.sh <<'EOF'
#!/usr/bin/env bash
n="$1"
for i in $(seq 1 "$n"); do
  for j in $(seq 1 "$n"); do
    echo "d$i x h$j"
  done
  if (( i >= 3 )); then
    break 2
  fi
done
EOF
