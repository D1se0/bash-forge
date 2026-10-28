cat > rango.sh <<'EOF'
#!/usr/bin/env bash
n=${1:-0}
if [ "$n" -lt 10 ]; then
  echo "bajo"
elif [ "$n" -lt 100 ]; then
  echo "medio"
else
  echo "alto"
fi
EOF
bash rango.sh 5; bash rango.sh 50; bash rango.sh 500
