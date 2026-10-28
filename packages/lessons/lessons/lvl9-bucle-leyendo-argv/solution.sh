cat > dilema.sh <<'EOF'
#!/usr/bin/env bash
nombre="nadie"
while (($#)); do
  case "$1" in
    -v)    echo "modo: apagado"; shift ;;
    -n)    nombre="$2"; shift 2 ;;
    *)     echo "misterio $1"; shift ;;
  esac
done
echo "persona: $nombre"
EOF
