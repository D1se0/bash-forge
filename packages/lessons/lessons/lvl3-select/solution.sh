cat > menu.sh <<'EOF'
#!/usr/bin/env bash
PS3="elección: "
select opt in "piedra" "papel" "tijera" "salir"; do
  [[ "$opt" == "salir" ]] && break
  echo "tomaste $opt"
done
EOF
printf '3\n' | bash menu.sh
