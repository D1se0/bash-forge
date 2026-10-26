/**
 * Tipos del manifiesto de lección y del progreso del alumno.
 * Contrato compartido entre el executor de lecciones (sandbox), la SPA y la web de docs.
 */

export type LessonKind = "lesson" | "challenge" | "boss" | "playground";
export type LessonLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface LessonLevelInfo {
  level: LessonLevel;
  /** Nombre del nivel, p. ej. "Primer contacto". */
  title: string;
  /** Rango de forja asociado al nivel (gamificación). */
  rank: string;
}

/** Configuración declarativa de validación, dentro de lesson.yaml. */
export interface ValidationSpec {
  /**
   * `declarative`: se generan aserciones de los `tasks` y el runner ejecuta
   * `setup.sh` + `check.sh` (autogenerado a partir de los `tasks`).
   * `script`: el check es íntegramente `check.sh` (retos complejos).
   */
  mode: "declarative" | "script";
  /** Tiempo máximo de ejecución de cada tarea, en segundos. */
  timeoutSeconds: number;
  /** Aserciones declarativas; cada una se puede puntuar individualmente. */
  tasks: ExpectedTask[];
}

/** Una aserción por-tarea: se compara el comportamiento real con lo esperado. */
export interface ExpectedTask {
  /** Identificador estable, mostrado en el informe de resultado. */
  name: string;
  /** Descripción legible; usada como mensaje de feedback del check. */
  message: string;
  /** Pista contextual si la tarea falla. */
  hint?: string;
  /** Comando no-interactivo a ejecutar en el home del alumno. */
  cmd: string;
  expectExit?: number;
  /** Regex Python/posix extendida; se comprueba con `grep -E`. */
  expectOutput?: string;
  expectOutputAbsent?: string;
  /** El fichero `path` debe existir en el home del alumno. */
  expectFile?: string;
  /** El fichero `path` debe existir y tener el bit de ejecución activo. */
  expectExecutable?: string;
  /** El contenido del fichero `path` debe casar con esta regex. */
  expectFileContains?: { path: string; regex: string };
  /** El stdout incluye la salida de `solution.sh` pasando por este filtro. */
  /** El check fallará si esta regex aparece en la salida. */
  /** Ficheros auxiliares que `setup.sh` puede preparar; aten a `cmd` las veces necesarias. */
  seed?: string;
}

/** Metadatos declarativos de una lección (lesson.yaml). */
export interface LessonMeta {
  /** Identificador estable tipo `lvl0-variables-echo`. */
  id: string;
  title: string;
  level: LessonLevel;
  kind: LessonKind;
  /** XP otorgado; los boss dan más. */
  xp: number;
  estimatedMinutes: number;
  prerequisites: string[];
  tags: string[];
  /** Objetivo en una frase, mostrado en el panel y la web de docs. */
  objective: string;
  /** Ficheros que el setup propone crear (no obligatorio, orientativo). */
  files_to_create?: string[];
  validation: ValidationSpec;
}

/** Lección completa tal como se entrega al cliente. */
export interface LessonContent extends LessonMeta {
  /** Markdown: teoría, ejemplo guiado, reto, errores típicos, quiz. */
  md: string;
  /** Pistas progresivas por nivel de paciencia. */
  hints: string[];
  /** Versión final comentada (no se envía a menos que se resuelva la lección). */
  solutionHidden?: boolean;
}

export const LESSON_LEVELS: LessonLevelInfo[] = [
  { level: 0, title: "Primer contacto", rank: "Aprendiz de la fragua" },
  { level: 1, title: "Variables y parámetros", rank: "Aprendiz de la fragua" },
  { level: 2, title: "Condicionales", rank: "Ayudante de herrero" },
  { level: 3, title: "Bucles y control de flujo", rank: "Ayudante de herrero" },
  { level: 4, title: "Funciones y estructura", rank: "Herrero" },
  { level: 5, title: "Entrada/salida y procesos", rank: "Herrero" },
  { level: 6, title: "Arrays y texto", rank: "Herrero de élite" },
  { level: 7, title: "Robustez y buenas prácticas", rank: "Herrero de élite" },
  { level: 8, title: "Proyectos finales", rank: "Maestro Forjador" },
];

/** Insignias y logros (gamificación). */
export interface Badge {
  id: string;
  title: string;
  description: string;
  /** Lección/metas que desbloquean la insignia, p. ej. completar nivel completo. */
  howToEarn: string;
  icon: string; // nombre de un emoji
}

export const BADGES: Badge[] = [
  { id: "quote-master", title: "Quote Master", description: "Domina las comillas y la expansión", howToEarn: "Completa el nivel 1", icon: "❝" },
  { id: "pipe-dream", title: "Pipe Dream", description: "Encadena procesos con gracia", howToEarn: "Completa el nivel 5", icon: "⛓" },
  { id: "trap-hunter", title: "Trap Hunter", description: "Ctrl+C atrapado", howToEarn: "Completa el nivel 7", icon: "🪤" },
  { id: "regexpal", title: "Regex Pal", description: "grep o awk que no hayan visto", howToEarn: "Completa el nivel 6", icon: "🔍" },
  { id: "forge-apprentice", title: "Aprendiz de la fragua", description: "Primer nivel superado", howToEarn: "Completa el nivel 0", icon: "🔥" },
  { id: "forge-master", title: "Maestro Forjador", description: "Antorcha encendida tras ocho niveles", howToEarn: "Completa todos los niveles", icon: "⛏" },
  { id: "streak-7", title: "Racha de 7", description: "7 días seguidos practicando", howToEarn: "Práctica diaria", icon: " streak" },
];

/** Progreso persistente del alumno. */
export interface ProgressSnapshot {
  /** Identificador de navegador: la clave de persistencia en el volumen. */
  forgeId: string;
  completed: string[]; // lessonIds
  xp: number;
  badges: string[]; // badgeIds
  /** Última fecha (ISO) con actividad para calcular la racha. */
  lastActiveDate: string | null;
  streak: number;
  theme: string;
  lang: "es" | "en";
}
