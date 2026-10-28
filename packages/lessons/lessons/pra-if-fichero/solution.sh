cat > checa.sh <<'EOF'
#!/usr/bin/env bash
if [ -f "$1" ]; then
  echo "existe"
else
  echo "no existe"
fi
EOF
bash checa.sh /etc/hostname
bash checa.sh /tmp
