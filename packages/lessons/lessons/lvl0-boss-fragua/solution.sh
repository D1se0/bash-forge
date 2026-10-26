cat > forge.sh <<'EOF'
#!/usr/bin/env bash
echo "Fragua encendida"
EOF
chmod +x forge.sh
mkdir -p forge/log
echo "# Forja de nivel 0" > README.md
./forge.sh
