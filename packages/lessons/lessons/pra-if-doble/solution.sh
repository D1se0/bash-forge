cat > acceso.sh <<'EOF'
#!/usr/bin/env bash
if [ -x "$1" ] && [ -r "$1" ]; then
  echo "ok"
else
  echo "no ok"
fi
EOF
bash acceso.sh /bin/ls
