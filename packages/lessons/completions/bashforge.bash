# bash forge completions
declare -A _bf_cmds=(
  [dev]=0 [down]=0 [lessons]=0 [check]=0 [list]=0 [verify]=1 [help]=0
)
_bashforge() {
  local word="${COMP_WORDS[1]}"
  if [[ "$COMP_CWORD" -eq 1 ]]; then
    COMPREPLY=( $(compgen -W 'dev down lessons check list verify help' -- "$word") )
  elif [[ "$COMP_CWORD" -eq 2 && "$word" == "verify" ]]; then
    COMPREPLY=( $(compgen -W "$(curl -fsS http://localhost:8010/api/lessons 2>/dev/null | tr -d '[],"' | tr ',' '\n')" -- "${COMP_WORDS[2]}") )
  fi
}
complete -F _bashforge bashforge
