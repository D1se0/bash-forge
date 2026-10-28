cat > menu.sh <<'EOF'
#!/usr/bin/env bash
while read -r op; do
  case "$op" in
    hola)  echo "¡hola!" ;;
    salir) echo "adiós"; break ;;
  esac
done
EOF
printf 'hola\nsalir\n' | bash menu.sh
