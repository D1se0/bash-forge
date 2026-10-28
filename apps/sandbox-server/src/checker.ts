import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { CheckDetail, ExpectedTask, LessonContent, ValidationSpec } from "@bashforge/shared";
import { LessonStore } from "./lessons";

/**
 * Ejecutor de checks. Regla de oro: **nunca** ejecutamos código del alumno como
 * root; las tareas corren como el usuario de sesión vía `su` con el script
 * entregado por stdin (el alumno no puede leer los checks: van 0700 root en
 * CHECKS_DIR y el `su` no les da lectura).
 *
 * Workspace por nivel: setup, seeds, checks y aserciones de ficheros trabajan
 * en `forja/nivel-N` dentro del home del alumno (la SPA cd-ifica la terminal
 * al mismo sitio al abrir una lección de ese nivel).
 */

/** Directorio de trabajo de un nivel, relativo al home del alumno. */
export function levelWorkdir(level: number | undefined): string {
  return `forja/nivel-${level ?? 0}`;
}

/** Workdir de una lección: la práctica dirigida vive en su propia pista. */
export function lessonWorkdir(lesson: LessonContent): string {
  const track = (lesson as LessonContent & { track?: string }).track;
  if (track) return `forja/practica/${track.toLowerCase()}`;
  return levelWorkdir(lesson.level);
}

export interface CheckRunResult {
  pass: boolean;
  checks: CheckDetail[];
  tookMs: number;
}

interface RunOneResult {
  exit: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
}

/** Ejecuta `script` como el usuario de sesión con cwd = su home. */
export function runAsUser(
  script: string,
  user: string,
  timeoutMs: number,
): RunOneResult {
  const result = spawnSync(
    "su",
    ["-s", "/bin/bash", "-l", user, "-c", "bash -s"],
    {
      cwd: "/",
      input: script,
      timeout: timeoutMs,
      encoding: "utf8",
      killSignal: "SIGKILL",
    },
  );
  return {
    exit: typeof result.status === "number" ? result.status : -1,
    stdout: (result.stdout ?? "").slice(0, 4000),
    stderr: (result.stderr ?? "").slice(0, 2000),
    timedOut: Boolean(result.error),
  };
}

export class LessonChecker {
  private readonly store: LessonStore;
  private readonly timeoutMs: number;

  constructor(store: LessonStore, timeoutSeconds: number) {
    this.store = store;
    this.timeoutMs = timeoutSeconds * 1000;
  }

  /** Corre `setup.sh` de la lección como el usuario (si la lección lo trae). */
  runSetup(lesson: LessonContent, user: string): { passed: boolean; stderr: string } {
    const raw = this.store.readRaw(lesson.id, "setup.sh");
    if (!raw) return { passed: true, stderr: "" };
    const out = runAsUser(this.wrapCd(raw, user, lessonWorkdir(lesson)), user, Math.min(this.timeoutMs, 60_000));
    return { passed: out.exit === 0, stderr: out.stderr };
  }

  /** Ejecuta el check completo (declarative o script-mode). */
  runCheck(lesson: LessonContent, user: string): CheckRunResult {
    const started = Date.now();
    const validation: ValidationSpec = lesson.validation;

    if (validation.mode === "script") {
      const script = this.store.readRaw(lesson.id, "check.sh");
      if (!script) {
        return {
          pass: false,
          tookMs: Date.now() - started,
          checks: [
            {
              id: "missing-check",
              name: "check.sh",
              pass: false,
              expected: "check.sh presente en la lección",
              got: "check.sh no existe",
              hint: "Error de la plataforma: reporta esta lección.",
            },
          ],
        };
      }
      const out = runAsUser(this.wrapCd(script, user, lessonWorkdir(lesson)), user, this.timeoutMs);
      const pass = out.exit === 0;
      return {
        pass,
        tookMs: Date.now() - started,
        checks: [
          {
            id: "script-check",
            name: "check.sh",
            pass,
            expected: "exit code 0",
            got: pass
              ? out.stdout || "(sin salida, ✔)"
              : `${out.stdout || "(sin stdout)"} ${out.stderr || ""} (exit ${out.exit})`.trim(),
            hint: pass ? undefined : "Lee el error que imprime el check; si no imprime, tu script no ha hecho nada.",
          },
        ],
      };
    }

    const checks: CheckDetail[] = [];
    let pass = true;
    for (const task of validation.tasks) {
      if (task.seed) this.seedTask(lesson, user, task.seed);
      const r = this.assertTask(user, task, lessonWorkdir(lesson));
      checks.push(r.detail);
      if (!r.pass) pass = false;
    }
    return { pass, checks, tookMs: Date.now() - started };
  }

  private seedTask(lesson: LessonContent, user: string, seed: string): void {
    const raw = this.store.readRaw(lesson.id, `seeds/${seed}`);
    if (!raw) return;
    runAsUser(this.wrapCd(raw, user, lessonWorkdir(lesson)), user, Math.min(this.timeoutMs, 30_000));
  }

  confirmUserCanRead(home: string, file: string): boolean {
    const p = path.join(home, file);
    return fs.existsSync(p);
  }

  /** Una aserción declarativa: cmd + expect* contra el home del usuario. */
  private assertTask(user: string, task: ExpectedTask, workdir?: string): { pass: boolean; detail: CheckDetail } {
    const home = workdir ? path.join(`/home/${user}`, workdir) : `/home/${user}`;
    const problems: string[] = [];

    if (task.expectFile) {
      const p = path.isAbsolute(task.expectFile) ? task.expectFile : path.join(home, task.expectFile);
      if (!fs.existsSync(p)) problems.push(`no existe el fichero ${task.expectFile}`);
    }
    if (task.expectExecutable) {
      const p = path.isAbsolute(task.expectExecutable)
        ? task.expectExecutable
        : path.join(home, task.expectExecutable);
      if (!fs.existsSync(p)) problems.push(`no existe ${task.expectExecutable}`);
      else {
        try {
          fs.accessSync(p, fs.constants.X_OK);
        } catch {
          problems.push(`${task.expectExecutable} no es ejecutable (falta chmod +x)`);
        }
      }
    }
    if (task.expectFileContains) {
      const p = path.isAbsolute(task.expectFileContains.path)
        ? task.expectFileContains.path
        : path.join(home, task.expectFileContains.path);
      if (!fs.existsSync(p)) {
        problems.push(`no existe ${task.expectFileContains.path}`);
      } else {
        const content = fs.readFileSync(p, "utf8");
        if (!new RegExp(task.expectFileContains.regex).test(content)) {
          problems.push(`${task.expectFileContains.path} no cumple el patrón /${task.expectFileContains.regex}/`);
        }
      }
    }

    // Las tareas solo-lectura de ficheros (expectFile*/expect*) no ejecutan nada.
    let run = { exit: 0 as number, stdout: "", stderr: "", timedOut: false };
    if (task.cmd && task.cmd.trim()) {
      run = runAsUser(this.wrapCd(task.cmd, user, workdir), user, this.timeoutMs);
      if (run.timedOut && run.exit === -1) {
        problems.push("la tarea agotó su tiempo (¿bucle infinito? ¿falta input?)");
      }
      if (run.exit >= 0) {
        const wantExit = task.expectExit ?? 0;
        if (run.exit !== wantExit) {
          problems.push(`exit code: esperado ${wantExit}, obtenido ${run.exit}`);
        }
      }
      // patrón 'm': ^/$ anclan por línea y con salida multilínea funcionan igual
      // select y algunas herramientas imprimen por stderr: el output esperable
      // puede vivir en cualquiera de los dos streams (lo que el alumno ve).
      if (task.expectOutput && !new RegExp(task.expectOutput, "m").test(run.stdout) && !new RegExp(task.expectOutput, "m").test(run.stderr)) {
        problems.push(`la salida no contiene /${task.expectOutput}/`);
      }
      if (task.expectOutputAbsent && new RegExp(task.expectOutputAbsent, "m").test(run.stdout + run.stderr)) {
        problems.push(`la salida no debería contener /${task.expectOutputAbsent}/`);
      }
    }

    const pass = problems.length === 0;
    const detail: CheckDetail = {
      id: task.name,
      name: task.message,
      pass,
      expected: task.message,
      got: pass
        ? "✔ correcto"
        : problems.join(" · ") + (run.stdout ? ` — salida recibida: ${run.stdout.slice(0, 200)}` : ""),
      hint: task.hint,
    };
    return { pass, detail };
  }

  /**
   * Ejecuta el script del alumno desde SU workspace de nivel (forja/nivel-N),
   * creándolo si todavía no existe tras un reset.
   */
  private wrapCd(script: string, user: string, workdir?: string): string {
    const home = `cd /home/${user} 2>/dev/null || cd "$HOME"`;
    if (!workdir) return `${home}\n${script}`;
    return `${home}\nmkdir -p '${workdir}' 2>/dev/null\ncd '${workdir}' 2>/dev/null || cd "$HOME"\n${script}`;
  }
}
