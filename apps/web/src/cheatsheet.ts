/**
 * Cheatsheet de Bash — referencia completa consultable desde un popup glass.
 * Cada entrada: término, firma, explicación y ejemplo ejecutable.
 * Secciones ordenadas como el currículum de la forja.
 */

export interface CheatEntry {
  /** Término o comando. */
  term: string;
  /** Firma o sintaxis breve. */
  sig?: string;
  /** Qué hace / cuándo usarlo. */
  desc: string;
  /** Ejemplo ejecutable (y su resultado si añade valor). */
  ex?: string;
}

export interface CheatSection {
  id: string;
  title: string;
  rune: string;
  entries: CheatEntry[];
}

export const CHEATSHEET: CheatSection[] = [
  {
    id: "variables",
    title: "Variables y asignación",
    rune: "ᚠ",
    entries: [
      { term: "asignación", sig: "nombre=valor", desc: "Asigna SIN espacios alrededor del =. El valor con espacios lleva comillas.", ex: "nombre=\"Alicia, la herrero\"" },
      { term: "$nombre", sig: "${nombre}", desc: "Lee la variable. Las llaves son obligatorias al pegar texto (${nombre}x) y recomendables siempre.", ex: "echo \"Hola, $nombre\"" },
      { term: "readonly", sig: "readonly VAR=valor", desc: "Congela la variable: reasignar falla con «readonly variable».", ex: "readonly version=5" },
      { term: "unset", sig: "unset VAR", desc: "Borra la variable (queda como si nunca existiera).", ex: "unset nombre" },
      { term: "local", sig: "local VAR=valor", desc: "Variable LOCAL a una función. Fuera de una función es un error.", ex: "local contador=0" },
      { term: "declare", sig: "declare -i n | -r | -a | -A | -x", desc: "-i entero  · -r readonly  · -a array indexado  · -A array asociativo  · -x exportar.", ex: "declare -i contador=0" },
      { term: "export", sig: "export VAR=valor", desc: "Publica la variable al ENTORNO: los procesos hijos la heredan. Sin export, es solo del shell actual.", ex: "export PATH=\"$HOME/bin:$PATH\"" },
      { term: "env / printenv", sig: "env | grep VAR", desc: "Lista el entorno del proceso. printenv VAR imprime su valor.", ex: "printenv HOME" },
      { term: "source / .", sig: "source fichero.sh", desc: "Ejecuta el fichero EN el shell actual (no crea procesos): sus variables y funciones quedan aquí.", ex: "source ~/.bashrc" },
      { term: "shift", sig: "shift [N]", desc: "Descarta los N primeros argumentos posicionales ($2 pasa a $1). Reacomoda $@ y $#.", ex: "shift   # descarta $1" },
    ],
  },
  {
    id: "expansion",
    title: "Expansión de parámetros",
    rune: "ᚱ",
    entries: [
      { term: "${VAR:-defecto}", desc: "Usa defecto si VAR es vacía o no existe. NO cambia VAR.", ex: "echo \"Puerto: ${PORT:-8080}\"" },
      { term: "${VAR:=defecto}", desc: "Defecto Y ASIGNA a VAR (no funciona con posicionales ni readonly).", ex: ": ${PORT:=8080}" },
      { term: "${VAR:?mensaje}", desc: "Si VAR falta o es vacía: aborta el script con mensaje (validación de entrada).", ex: ": \"${DESTINO:?Falta el destino}\"" },
      { term: "${VAR:+algo}", desc: "Devuelve algo SOLO si VAR tiene valor; si no, cadena vacía.", ex: "echo \"debug:$DEBUG\"" },
      { term: "${#VAR}", desc: "Longitud de la cadena (o nº de elementos en un array).", ex: "echo ${#nombre}" },
      { term: "${VAR:N:L}", desc: "Rodaja de la cadena: desde el carácter N, longitud L.", ex: "echo ${nombre:0:4}" },
      { term: "${VAR#patrón} / ##", desc: "Borra del INICIO la parte que casa el patrón (más corta / más larga).", ex: "echo ${fichero##*.}   # extensión" },
      { term: "${VAR%patrón} / %%", desc: "Borra del FINAL la parte casante (corta / larga).", ex: "echo ${fichero%.*}    # sin extensión" },
      { term: "${VAR/orig/nuevo} / //", desc: "Sustituye la PRIMERA coincidencia / TODAS.", ex: "echo ${ruta// /_}     # espacios → _" },
      { term: "${VAR^} / , / ^^ / ,, ", desc: "Mayúscula inicial / minúscula inicial / TODO mayúsculas / todo minúsculas.", ex: "echo ${titulo^^}" },
      { term: "$((expr))", sig: "aritmética", desc: "Expansión aritmética de enteros: + - * / % ** ++ -- y vecinos.", ex: "echo $((5 * 3 + 1))" },
      { term: "{1..10} / {a,c} / {x,y,z}", desc: "Brace expansion: rangos y listas generadas por el shell ANTES de ejecutar.", ex: "mkdir -p mod{01..12}" },
      { term: "~", desc: "Expande al HOME del usuario: ~/, ~/otro, ~usuario.", ex: "cd ~/scripts" }
    ],
  },
  {
    id: "especiales",
    title: "Parámetros especiales",
    rune: "$",
    entries: [
      { term: "$1…$9, ${10}…", desc: "Argumentos posicionales. A partir del 10, obligatorio con llaves.", ex: "echo \"Primo: $1\"" },
      { term: "$0", desc: "Nombre con que se invocó el script (o el shell).", ex: "echo $0" },
      { term: "$#", desc: "Número de argumentos recibidos.", ex: "echo \"Recibidas $# piezas\"" },
      { term: "$@ / $*", desc: "Todos los argumentos. EN COMILLAS (\"$@\") cada uno conserva sus espacios; $* los funde en una cadena.", ex: "for arg in \"$@\"; do echo $arg; done" },
      { term: "$?", desc: "Código de salida del ÚLTIMO comando (0 = ok). Se machaca con cada nueva orden.", ex: "cat /no-existe; echo $?" },
      { term: "$$", desc: "PID del shell actual.", ex: "echo $$ > /tmp/mi.pid" },
      { term: "$!", desc: "PID del último trabajo lanzado en background.", ex: "sleep 60 & echo $!" },
      { term: "set --", sig: "set -- a b c", desc: "Reinstala la lista de argumentos desde cero (utilísimo para reordenar).", ex: "set -- \"$3\" \"$2\" \"$1\"" },
      { term: "$IFS", desc: "Separador de campos del word-splitting (por defecto espacio-tab-salto).", ex: "IFS=: read a b c <<< \"x:y:z\"" },
    ],
  },
  {
    id: "comillas",
    title: "Comillas y escapado",
    rune: "❝",
    entries: [
      { term: "\"doubles\"", desc: "Agrupan PRESERVANDO la expansión de $var, $(cmd), $((expr)). Úsalas por defecto.", ex: "echo \"Hola, $USER\"" },
      { term: "'simples'", desc: "TODO literal: ni $ ni escapes se interpretan. Para textos fijos con símbolos.", ex: "echo 'literal: $USER'" },
      { term: "$'ANSI'", desc: "Interpreta escapes: \\n salto, \\t tab, unicode.", ex: "echo $'a\\tb'" },
      { term: "\\", desc: "Escapa el carácter siguiente; como última letra de línea la une con la siguiente.", ex: "echo \"\\$HOME literal\"" },
      { term: "cuándo \"$var\"", desc: "Regla de oro: CUALQUIER variable o expansión entre comillas dobles para evitar word-splitting y glob sorpresas.", ex: "cp \"$fichero con espacios\" /tmp/" },
    ],
  },
  {
    id: "condicionales",
    title: "Condicionales y test",
    rune: "ᚴ",
    entries: [
      { term: "if/if-else/if-elif", sig: "if [ cond ]; then … elif … else … fi", desc: "Decisión clásica. OBLIGATORIO: espacios dentro de [ ] y un ; (o salto) antes de then.", ex: "if [ -f fichero ]; then echo sí; fi" },
      { term: "[ = ] comprobaciones de fichero", desc: "-e existe · -f fichero · -d directorio · -r/-w/-x permisos · -s tamaño>0 · -L enlace · -ot más viejo · -nt más nuevo.", ex: "if [ -d log ]; then …" },
      { term: "[ = ] comparaciones de cadena", desc: "= igual · != distinto · -z vacía · -n no-vacía. Con corchetes [[ ]] no hace falta escapar.", ex: "[ \"$a\" = \"$b\" ]" },
      { term: "[ = ] comparaciones numéricas", desc: "-eq · -ne · -lt · -le · -gt · -ge (o usa (( )) con <, >, ==).", ex: "if [ $n -ge 10 ]; then …" },
      { term: "[[ … ]]", desc: "Comando compuesto con lógica && ||, regex =~ y sin word-splitting. Preferible a [ ] en scripts.", ex: "if [[ $rama =~ ^feat/ ]]; then …" },
      { term: "(( ))", desc: "Aritmética y booleano: 0 = falso, resto = verdadero. Sin $ dentro.", ex: "if (( n >= 10 )); then …" },
      { term: "case", sig: "case $x in patrón) …;; esac", desc: "Mascarillas por patrones glob: es más limpio que elifs encadenados.", ex: "case $op in start) echo arranco;; stop) echo paro;; *) echo ¿?;; esac" },
      { term: "&& || ;", desc: "AND/OR en cortocircuito: cmd1 && cmd2 (si ok) · cmd1 || cmd2 (si falla).", ex: "test -d mod || mkdir -p mod" },
    ],
  },
  {
    id: "bucles",
    title: "Bucles",
    rune: "ᚦ",
    entries: [
      { term: "for lista", sig: "for x in a b c; do …; done", desc: "Itera sobre palabras (¡NO es numérico!).", ex: "for f in *.sh; do echo $f; done" },
      { term: "for ((i))", sig: "for ((i=0; i<10; i++)); do …; done", desc: "El for «clásico» de C por enteros.", ex: "for ((i=1;i<=3;i++)); do echo $i; done" },
      { term: "while", sig: "while cond; do …; done", desc: "Repite MIENTRAS la condición salga 0 (éxito).", ex: "while read line; do echo $line; done < fichero" },
      { term: "until", sig: "until cond; do …; done", desc: "Lo contrario del while: repite HASTA que la condición salga 0.", ex: "until [ -f centinela ]; do sleep 1; done" },
      { term: "break / continue", desc: "Sal del bucle (o de N niveles con break N) / salta a la siguiente iteración.", ex: "for f in *; do [[ $f == *.tmp ]] && continue; … done" },
      { term: "read -ra", sig: "read -ra arr <<< \"a b c\"", desc: "Trocea una cadena en un array por IFS.", ex: "read -ra piezas <<< \"una dos tres\"" },
      { term: "mapfile", sig: "mapfile -t líneas < fichero", desc: "Vuelca todas las líneas del fichero en un array (sin \n final).", ex: "mapfile -t tareas < lista.txt" },
    ],
  },
  {
    id: "funciones",
    title: "Funciones",
    rune: "ᚨ",
    entries: [
      { term: "definición", sig: "hola() { echo hi; }", desc: "Declara una función (la palabra function es opcional). Debe definirse ANTES de llamarse.", ex: "saluda() { echo \"¡Hola, $1!\"; }" },
      { term: "return", sig: "return N", desc: "CÓDIGO DE SALIDA de la función (0..255), no un valor. Para devolver datos: echo y capturar.", ex: "es_par() { return $(( $1 % 2 )); }" },
      { term: "capturar salida", sig: "resultado=$(función)", desc: "La stdout de la función viaja por la sustitución de comandos.", ex: "suma() { echo $(( $1 + $2 )); }; total=$(suma 2 3)" },
      { term: "argumentos", desc: "Dentro de la función: $1… $@ y $# son SUS argumentos (no los del script).", ex: "saluda \"Alicia\"   # $1 = Alicia" },
      { term: "local", desc: "Las variables son GLOBALES por defecto: decláralas local dentro de la función.", ex: "local tmp=$(mktemp)" },
      { term: "export -f", sig: "export -f fn", desc: "Exporta la función a los shells hijos (los definen al arrancar).", ex: "export -f saluda; bash -c saluda" },
    ],
  },
  {
    id: "arrays",
    title: "Arrays",
    rune: "ᚬ",
    entries: [
      { term: "definición", sig: "arr=(uno dos tres)", desc: "Array indexado: cada elemento es una palabra, espacios protegidos.", ex: "runas=(fehu uruz thurisaz)" },
      { term: "${arr[i]} / ${arr[@]}", desc: "Elemento i / todos los elementos (SIEMPRE entre comillas: \"${arr[@]}\").", ex: "echo \"${runas[0]} · ${runas[-1]}\"" },
      { term: "${#arr[@]}", desc: "Número de elementos.", ex: "echo \"Hay ${#runas[@]} runas\"" },
      { term: "arr+=(nuevo)", desc: "Añade al final (o arr[i]=nuevo para fijar posición).", ex: "runas+=(ansuz)" },
      { term: "${arr[@]:N:L}", desc: "Rodaja: desde el índice N, L elementos.", ex: "echo \"${runas[@]:1:2}\"" },
      { term: "unset arr[i]", desc: "Borra UN elemento (el resto conserva su índice; hay huecos).", ex: "unset runas[1]" },
      { term: "arrays asociativos", sig: "declare -A dic", desc: "Mapa clave→valor: dic[clave]=valor, ${dic[clave]}.", ex: "declare -A xp; xp[herrero]=100; echo ${xp[herrero]}" },
    ],
  },
  {
    id: "streams",
    title: "Redirección y tuberías",
    rune: "ᛁ",
    entries: [
      { term: "> / >>", desc: "Redirige stdout a un fichero: > TRUNCA, >> AÑADE. Crea el fichero si no existe.", ex: "echo línea >> log.txt" },
      { term: "<", desc: "Redirige un fichero como ENTRADA del comando.", ex: "wc -l < log.txt" },
      { term: "2> / 2>&1 / &>", desc: "stderr a fichero · stderr al stdout actual · ambos juntos.", ex: "cmd > out.txt 2> err.txt" },
      { term: "|", desc: "Pipe: la stdout de uno alimenta el stdin del siguiente.", ex: "cat access.log | sort | uniq -c | sort -rn | head" },
      { term: "tee", sig: "tee [-a] fichero", desc: "Reparte la salida: la muestra Y la guarda (-a para añadir).", ex: "make 2>&1 | tee build.log" },
      { term: "<<<", desc: "Here-string: inyecta UNA cadena como stdin del comando.", ex: "bc <<< \"2^10\"" },
      { term: "<< EOF", desc: "Here-doc: inyecta un bloque multilínea. Con 'EOF' entrecomillado NO expande $.", ex: "cat > notas <<'EOF'\n…\nEOF" },
      { term: "/dev/null", desc: "Agujero negro: descarta salida (2>/dev/null silencia errores).", ex: "grep -q hola archivo 2>/dev/null" },
      { term: "xargs", sig: "… | xargs cmd", desc: "Construye comandos usando los datos del pipe como argumentos.", ex: "find . -name '*.tmp' | xargs rm -f" },
      { term: "$( )", desc: "Sustitución de comandos: captura la stdout de un comando como texto (moderna; hay que evitar las comillas invertidas antiguas).", ex: "hoy=$(date +%F)" },
    ],
  },
  {
    id: "procesos",
    title: "Procesos, señales y jobs",
    rune: "ᛈ",
    entries: [
      { term: "cmd &", desc: "Lanza en background: el shell sigue y el trabajo corre.", ex: "cp -r grande / &" },
      { term: "jobs / fg / bg", desc: "Lista trabajos · trae al frente · reanuda en background.", ex: "jobs -l" },
      { term: "Ctrl+C / Ctrl+Z", desc: "SIGINT (mata el primer plano) / SIGTSTP (pausa; luego bg para reanudar).", ex: "— atajo de teclado —" },
      { term: "wait", sig: "wait [pid]", desc: "Espera a que termine un job/hijo y hereda su $?.", ex: "cmd1 & cmd2 & wait" },
      { term: "trap", sig: "trap cmd SIG…", desc: "Atrapar señales: limpieza al salir, ignorar interruption…", ex: "trap 'echo adios; rm -f $tmp' EXIT" },
      { term: "nohup / disown", desc: "Sobrevive al cierre del terminal: nohup cmd & desata el proceso de la sesión.", ex: "nohup server.sh > /dev/null 2>&1 &" },
      { term: "( ) / { }", desc: "GRUPO en subshell (sus variables no salen) / GRUPO en el shell actual (necesita ; final).", ex: "(cd /tmp && pwd)   # VUELVE al original" },
      { term: "command / builtin / type", desc: "type cmd dice si es alias, builtin o binario; command omite alias y funciones.", ex: "type -a ll" },
    ],
  },
  {
    id: "io",
    title: "Entrada/salida y texto",
    rune: "ᛞ",
    entries: [
      { term: "read", sig: "read [opts] VAR", desc: "Lee UNA línea del stdin. -p prompt · -s silencio (PIN) · -n N caracteres · -t TIMEOUT · -r crudo.", ex: "read -rp \"¿Nombre? \" nombre" },
      { term: "printf", sig: "printf FORMATO args", desc: "Formato tipo C: %s cadena, %d entero, %f float, \n con el formato. MÁS potente que echo.", ex: "printf '%s → %d\\n' edad 34" },
      { term: "echo", desc: "Imprime con salto. -n sin salto, -e interpreta escapes. Para firmas exactas prefiere printf.", ex: "echo \"Hola, mundo\"" },
      { term: "test / [", desc: "Comprueba OPCIÓN o comparación; sale 0/1. [ COND ] y test COND son lo mismo.", ex: "test -f nota && echo hay-nota" },
      { term: "grep", sig: "grep [-iEnqv] PATRÓN ficheros", desc: "Busca patrones (regex). -i ignora caja · -n línea · -E extendida · -c cuenta · -q silencioso (solo $?).", ex: "grep -nE '^forge' /etc/passwd" },
      { term: "sort / uniq", desc: "Ordena líneas / elimina repetidas consecutivas (uniq -c cuenta).", ex: "sort | uniq -c | sort -rn" },
      { term: "cut / tr", desc: "Corta por columnas o delimitador / traslada o borra caracteres.", ex: "cut -d: -f1 /etc/passwd | tr a-z A-Z" },
      { term: "sed", sig: "sed [-i] 's/viejo/nuevo/g'", desc: "Editor de flujo: sustituye, borra, inserta por patrones.", ex: "sed -i 's/DEBUG/TRACE/g' config.sh" },
      { term: "awk", sig: "awk '{print $N}'", desc: "Procesa líneas por campos ($1…). -F fija el separador.", ex: "awk -F: '{print $1}' /etc/passwd" },
      { term: "find", sig: "find ruta [-name] [-type]", desc: "Busca ficheros por opciones (-name, -type d, -mtime, -exec).", ex: "find . -type f -name '*.sh' -exec chmod +x {} +" },
      { term: "wc / head / tail", desc: "Cuenta líneas/palabras/bytes ·primeras N (-n N) · últimas N / sigue en vivo (-f).", ex: "wc -l log.txt; tail -n 5 log.txt" },
      { term: "man / --help", desc: "Manual del comando (q sale) y ayuda de uso (`cat --help`).", ex: "man bash | head -20" },
    ],
  },
  {
    id: "script",
    title: "Estructura de un script robusto",
    rune: "ᛊ",
    entries: [
      { term: "#!/usr/bin/env bash", desc: "Shebang: PRIMERA del fichero. Indica al kernel qué intérprete lanzar.", ex: "#!/usr/bin/env bash" },
      { term: "set -euo pipefail", desc: "Modo estricto: -e sal al primer error · -u error en var sin definir · -o pipefail el pipeline falla si un tramo falla.", ex: "set -euo pipefail" },
      { term: "chmod +x", desc: "Da permiso de ejecución al script (requerido para ./script.sh).", ex: "chmod +x despliega.sh && ./despliega.sh" },
      { term: "exit N", desc: "Termina el script con ese código (0 ok, otro error). Si no, es el $? del último comando.", ex: "exit 1" },
      { term: "# comentario", desc: "Todo lo tras # en una línea no se ejecuta: documenta el POR QUÉ.", ex: "# valida el hook antes de subir" },
      { term: "getopts", sig: "getopts \"ab:c\" opt", desc: "Parsea opciones cortas: a sin argumento, b: exige valor. La variable OPTARG guarda el valor.", ex: "while getopts \"vo:\" o; do case $o in v) echo verbose;; o) out=$OPTARG;; esac; done" },
      { term: "alias", sig: "alias ll='ls -la'", desc: "Atajo de nombre definido en el shell interactivo (no viaja a los scripts).", ex: "alias ll='ls -lha'" },
      { term: "mktemp", desc: "Crea un fichero/directorio temporal ÚNICO y seguro.", ex: "tmp=$(mktemp); trap 'rm -f \"$tmp\"' EXIT" },
    ],
  },
  {
    id: "teclas",
    title: "Atajos del shell interactivo",
    rune: "ᛕ",
    entries: [
      { term: "↑ / ↓", desc: "Historial de comandos anterior/siguiente.", ex: "—" },
      { term: "Ctrl+R", desc: "Búsqueda reversiva en el historial (repite para retroceder).", ex: "—" },
      { term: "Ctrl+C / Ctrl+D", desc: "Cancela el comando en curso / EOF: cierra el shell o termina la entrada.", ex: "—" },
      { term: "Ctrl+A / Ctrl+E", desc: "Salta al inicio / final de la línea.", ex: "—" },
      { term: "Ctrl+U / Ctrl+K", desc: "Corta hasta el inicio / hasta el final de la línea.", ex: "—" },
      { term: "Ctrl+L", desc: "Limpia la pantalla (= clear).", ex: "—" },
      { term: "!$ / !!", desc: "Último argumento del comando previo / repite el comando previo.", ex: "mkdir mod01 mod02; cd !$" },
      { term: "Alt+.", desc: "Pega al cursor el último argumento (repite para ir hacia atrás).", ex: "—" },
      { term: "history", sig: "history | tail -N", desc: "Lista los comandos numerados; !N ejecuta el N.", ex: "history | tail -5" },
    ],
  },
];
