cat > reverse.sh <<'EOF'
#!/usr/bin/env bash
case $# in
  1) set -- "$1" ;;
  2) set -- "$2" "$1" ;;
  3) set -- "$3" "$2" "$1" ;;
esac
for a in "$@"; do echo "rev: $a"; done
EOF
bash reverse.sh a b
