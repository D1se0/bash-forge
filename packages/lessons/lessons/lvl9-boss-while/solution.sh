printf 'subir 10\n# comentario\nsubir 20\nstop\nsubir 99\n' > manifiesto.txt
cat > guardian.sh <<'EOF'
#!/usr/bin/env bash
rumbo=0
while IFS= read -r l; do
  case "$l" in
    \#*)       continue ;;
    stop)      break ;;
    subir*)    rumbo=$((rumbo + ${l#subir })) ;;
  esac
done < manifiesto.txt
echo "rumbo: $rumbo"
EOF
