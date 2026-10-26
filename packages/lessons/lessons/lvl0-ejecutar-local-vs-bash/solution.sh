cat > runme.sh <<'EOF'
#!/usr/bin/env bash
echo "Modo ./"
EOF
cat > misma.sh <<'EOF'
#!/usr/bin/env bash
echo "vertical: $0"
EOF
chmod +x runme.sh
./runme.sh
bash misma.sh
