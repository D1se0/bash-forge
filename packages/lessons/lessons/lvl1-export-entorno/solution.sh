cat > hijo.sh <<'EOF'
#!/usr/bin/env bash
echo "Veo: ${LLAVE:-nada}"
EOF
cat > envpass.sh <<'EOF'
#!/usr/bin/env bash
export LLAVE=emergencias
bash hijo.sh
EOF
bash envpass.sh
