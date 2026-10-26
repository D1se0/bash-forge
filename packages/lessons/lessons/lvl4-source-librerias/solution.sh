cat > lib.sh <<'EOF'
#!/usr/bin/env bash
medir() {
  echo "medir: $1"
}
EOF
cat > usalib.sh <<'EOF'
#!/usr/bin/env bash
source lib.sh
medir herramienta
EOF
bash usalib.sh
