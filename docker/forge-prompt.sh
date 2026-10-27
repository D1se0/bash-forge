# PROMPT_BASH_FORGE — PS1 de la forja, solo cuando corre bajo el sandbox
# (colores: frost 109 = teal de usuario, aurora 179 = ámbar del ❯)
# shellcheck disable=SC2016
case "$-" in
  *i*) ;;
  *) return 0 ;;
esac
if [ -n "$FORGE_USER" ]; then
  PS1='\[\033[38;5;109m\]'"$FORGE_USER"'@forge\[\033[0m\]:\w\[\033[38;5;179m\]❯\[\033[0m\] '
fi
