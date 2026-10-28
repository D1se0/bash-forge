cat > extension.sh <<'EOF'
#!/usr/bin/env bash
case "$1" in
  *.sh)  echo "guion" ;;
  *.txt) echo "texto" ;;
  *.png) echo "imagen" ;;
  *)     echo "otro" ;;
esac
EOF
bash extension.sh script.sh; bash extension.sh datos.csv
