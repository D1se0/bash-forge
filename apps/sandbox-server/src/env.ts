import path from "node:path";

/** Configuración del sandbox-server, todas las claves sobreescribibles por env. */
export interface EnvConfig {
  httpPort: number;
  lessonsDir: string;
  progressDir: string;
  checksDir: string;
  skelDir: string;
  homeRoot: string;
  poolSize: number;
  sessionTtlMinutes: number;
  maxSessionMinutes: number;
  maxSessions: number;
  maxTermsPerConnection: number;
  maxMessageRate: number;
  idleTimeoutSeconds: number;
  /** Duración máxima de un check individual en segundos. */
  checkTimeoutSeconds: number;
}

function num(name: string, def: number): number {
  const v = process.env[name];
  if (!v) return def;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : def;
}

function isDirString(v: string): v is string {
  return v.startsWith("/");
}

export function loadEnv(config: NodeJS.Dict<string> = process.env): EnvConfig {
  const lessonsDir = config["LESSONS_DIR"];
  const homeRoot = config["HOME_ROOT"];
  const progressDir = config["PROGRESS_DIR"];
  const checksDir = config["CHECKS_DIR"];
  const skelDir = config["SKEL_DIR"];
  return {
    httpPort: num("PORT", 3000),
    lessonsDir:
      lessonsDir && isDirString(lessonsDir)
        ? lessonsDir
        : path.resolve("/opt/bashforge/lessons"),
    progressDir:
      progressDir && isDirString(progressDir)
        ? progressDir
        : path.resolve(homeRoot ?? "/home", ".progress"),
    checksDir: checksDir && isDirString(checksDir) ? checksDir : path.resolve("/opt/bashforge/checks"),
    skelDir: skelDir && isDirString(skelDir) ? skelDir : path.resolve("/etc/skel.bashforge"),
    homeRoot: homeRoot && isDirString(homeRoot) ? homeRoot : "/home",
    poolSize: num("POOL_SIZE", 500),
    sessionTtlMinutes: num("SESSION_TTL_MIN", 60),
    maxSessionMinutes: num("SESSION_MAX_MIN", 720),
    maxSessions: num("MAX_SESSIONS", 50),
    maxTermsPerConnection: num("MAX_TERMS", 6),
    maxMessageRate: num("MAX_MSG_RATE", 120),
    idleTimeoutSeconds: num("IDLE_TIMEOUT_S", 300),
    checkTimeoutSeconds: num("CHECK_TIMEOUT_S", 60),
  };
}
