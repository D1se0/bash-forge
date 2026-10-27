import { useEffect, useMemo, useState } from "react";
import { markdownToHtml } from "./markdown";
import type { CheckDetail, LessonContent, LessonMeta, ProgressSnapshot } from "@bashforge/shared";
import { BADGES, LESSON_LEVELS } from "@bashforge/shared";
import type { ForgeWs } from "./wsClient";
import type { LessonLevel, LessonLevelInfo } from "@bashforge/shared";
import type { LevelGroup } from "./catalog";
import { isLevelLocked, unlockedLevel } from "./catalog";
import { ProgressPopup } from "./progress-popup";

/** ------------------------------------------------------------------ */
/** Barra lateral: árbol de niveles + progreso XP.                      */
/** ------------------------------------------------------------------ */

export interface SidebarProps {
  groups: LevelGroup[];
  progress: ProgressSnapshot;
  current: string | null;
  onSelect: (id: string) => void;
  /** Importar un snapshot de progreso exportado desde otra máquina (null = fichero inválido). */
  onImport: (p: ProgressSnapshot | null) => void;
}

/** Orden canónico del currículum (nivel asc, luego id): la ruta de la forja. */
export function flatOrder(groups: LevelGroup[]): LessonMeta[] {
  return groups.flatMap((g) => g.lessons);
}

export function Sidebar({ groups, progress, current, onSelect, onImport }: SidebarProps) {
  const route = useMemo(() => flatOrder(groups), [groups]);
  const completed = progress.completed;
  const next = route.find((l) => !completed.includes(l.id)) ?? null;
  const doneCount = route.filter((l) => completed.includes(l.id)).length;
  const pct = route.length ? Math.round((doneCount / route.length) * 100) : 0;

  // desbloqueo progresivo: el nivel N se abre al completar TODAS las del N-1
  const unlocked = useMemo(() => unlockedLevel(progress.completed, groups), [progress.completed, groups]);

  // niveles abiertos: los desbloqueados hasta el del siguiente paso (controlado, para no pelear con <details>)
  // persistidos: al recargar, la forja retoma EN la sección donde estabas
  const [openLevels, setOpenLevels] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("bf.openLevels");
    if (saved) {
      try {
        const arr = JSON.parse(saved) as number[];
        if (Array.isArray(arr) && arr.length) return new Set(arr);
      } catch {
        /* guarda corrupta: recalcula */
      }
    }
    const limit = next?.level ?? 0;
    return new Set(LESSON_LEVELS.filter((l) => l.level <= limit).map((l) => l.level));
  });
  const toggleLevel = (level: number, open: boolean) => {
    setOpenLevels((prev) => {
      const s = new Set(prev);
      if (open) s.add(level);
      else s.delete(level);
      try {
        localStorage.setItem("bf.openLevels", JSON.stringify([...s]));
      } catch {
        /* modo privado */
      }
      return s;
    });
  };

  const [popAbierto, setPopAbierto] = useState(false);

  return (
    <aside className="sidebar">
      <div className="xp-block">
        <div className="xp-top">
          <span className="xp-value">{progress.xp} XP</span>
          <span className="xp-meta">🔥 {progress.streak}d</span>
        </div>
        <div className="xp-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="xp-meta">
          {doneCount} de {route.length} lecciones · {pct}% del camino
        </div>
        {progress.badges.length > 0 && (
          <div className="badges-row">
            {BADGES.filter((b) => progress.badges.includes(b.id)).map((b) => (
              <span key={b.id} title={`${b.title}: ${b.description}`}>{b.icon}</span>
            ))}
          </div>
        )}
      </div>

      {next ? (
        <button className="next-card" onClick={() => onSelect(next.id)} title={next.objective}>
          <span className="next-kicker">ᚱ Tu siguiente paso</span>
          <span className="next-title">{next.title}</span>
          <span className="next-meta">
            Nivel {next.level} · {next.xp} XP · ▶ Continuar
          </span>
        </button>
      ) : (
        <div className="next-card complete">
          <span className="next-kicker">ᛒ Plan completo</span>
          <span className="next-title">¡Forja dominada!</span>
          <span className="next-meta">Repasa lo que quieras</span>
        </div>
      )}

      <div className="tree-title">El camino de la forja</div>
      <nav className="lesson-tree">
        {groups.map((g) => {
          const done = g.lessons.filter((l) => completed.includes(l.id)).length;
          const locked = isLevelLocked(g.info.level, unlocked);
          const allDone = done === g.lessons.length;
          return (
            <details
              key={g.info.level}
              className={`level-group${locked ? " locked" : ""}`}
              open={!locked && openLevels.has(g.info.level)}
              onToggle={(e) => toggleLevel(g.info.level, (e.target as HTMLDetailsElement).open)}
            >
              <summary>
                <span className="lvl-badge">L{g.info.level}</span>
                <span className="lvl-name">{g.info.title}</span>
                {locked ? <span className="lvl-lock">🔒 desbloquea con L{g.info.level - 1}</span> : null}
                <span className="lvl-progress" data-full={allDone ? "yes" : "no"}>
                  {done}/{g.lessons.length}
                </span>
              </summary>
              <ul>
                {g.lessons.map((l, i) => {
                  const done = completed.includes(l.id);
                  const isNext = next?.id === l.id;
                  return (
                    <li key={l.id}>
                      <button
                        className={`lesson-link${current === l.id ? " current" : ""}${done ? " done" : ""}${isNext ? " next" : ""}${locked ? " locked" : ""}`}
                        onClick={() => onSelect(l.id)}
                        title={locked ? `Completa el nivel ${g.info.level - 1} para desbloquear` : l.objective}
                        disabled={locked}
                      >
                        <span className={`step-dot${done ? " done" : ""}${isNext ? " now" : ""}${locked ? " lockdot" : ""}`}>
                          {locked ? "🔒" : done ? "✓" : String(i + 1)}
                        </span>
                        <span className="lesson-title">{l.title}</span>
                        {l.kind === "boss" && <span className="kind-chip boss">Boss</span>}
                        {l.kind === "challenge" && <span className="kind-chip">Reto</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}      </nav>

      <div className="progress-io">
        <button
          className="ghost"
          onClick={() => setPopAbierto(true)}
          title="Exportar/importar tu progreso y descargarte el informe en PDF"
        >
          ⇪ ⇩ Progreso · PDF
        </button>
      </div>
      {popAbierto && (
        <ProgressPopup groups={groups} progress={progress} onClose={() => setPopAbierto(false)} onImport={onImport} />
      )}
    </aside>
  );
}

/** ------------------------------------------------------------------ */
/** Panel de lección: teoría, pistas, botón Comprobar y resultado.      */
/** ------------------------------------------------------------------ */

export interface LessonPanelProps {
  lesson: LessonContent | null;
  ws: ForgeWs;
  done: boolean;
  onCompleted: (lessonId: string) => void;
  checks: CheckDetail[] | null;
  busy: string | null;
  currentTermId: string | null;
  /** siguiente paso del camino (para el botón «Continuar» tras aprobar) */
  nextLesson: LessonMeta | null;
  onGoNext: (id: string) => void;
}

export function LessonPanel({ lesson, ws, done, onCompleted, checks, busy, currentTermId, nextLesson, onGoNext }: LessonPanelProps) {
  const [hintLevel, setHintLevel] = useState(0);
  useEffect(() => setHintLevel(0), [lesson?.id]);

  const html = useMemo(() => (lesson ? markdownToHtml(lesson.md) : ""), [lesson]);

  if (!lesson) {
    return (
      <section className="lesson-panel empty">
        <h2>Elige una lección</h2>
        <p>
          Selecciona en el árbol de la izquierda. Cada lección te deja practicar
          en la terminal real de la derecha y validar tu trabajo con las aserciones.
        </p>
      </section>
    );
  }

  const lvlInfo = LESSON_LEVELS.find((l) => l.level === lesson.level);
  const shownHints = lesson.hints.slice(0, hintLevel);

  // validación por salida: aserciones que comparan el stdout del script del alumno
  const outputTasks = (lesson.validation?.tasks ?? []).filter((t) => t.expectOutput).slice(0, 4);

  const runSetup = () => ws.send({ type: "exercise:setup", lessonId: lesson.id });
  const runCheck = () => ws.send({ type: "exercise:check", lessonId: lesson.id });

  return (
    <section className="lesson-panel" data-lesson={lesson.id}>
      <header className="lesson-head">
        <h2>
          <span className="kind-icon">
            {lesson.kind === "boss" ? "👹" : lesson.kind === "challenge" ? "⚔️" : "📘"}
          </span>{" "}
          {lesson.title}
        </h2>
        <div className="lesson-meta">
          <span className="lvl-badge">L{lesson.level}</span>
          <span>{lvlInfo?.rank}</span>
          <span>⏱ {lesson.estimatedMinutes} min</span>
          <span>⭐ {lesson.xp} XP</span>
          {done && <span className="done-tag">✅ completada</span>}
        </div>
        <p className="objective">{lesson.objective}</p>
        {outputTasks.length > 0 && (
          <div className="expected-outputs">
            <div className="eo-title">🎯 Cómo se valida: por la SALIDA de tu script</div>
            <p className="eo-note">
              Aquí no importa CÓMO lo programes (hay infinitas formas correctas): el validador ejecuta
              tu script y compara lo que imprime con esto. Escribelo a tu manera y haz que la salida coincida.
            </p>
            {outputTasks.map((t) => (
              <div key={t.name} className="eo-task">
                <span className="eo-msg">{t.message}</span>
                <pre className="eo-code">$ {t.cmd}\n{String(t.expectOutput)}</pre>
              </div>
            ))}
            <p className="eo-hint">(^ … $ ancla la línea · \\n separa líneas: cada fragmento es una línea impresa por tu script)</p>
          </div>
        )}
      </header>

      <article className="lesson-md" dangerouslySetInnerHTML={{ __html: html }} />

      {shownHints.length > 0 && (
        <details open className="hints">
          <summary>Pistas</summary>
          <ol>
            {shownHints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ol>
        </details>
      )}
      {hintLevel < lesson.hints.length && (
        <div className="hint-actions">
          <button className="ghost" onClick={() => setHintLevel((n) => n + 1)}>
            💡 Dame una pista ({hintLevel}/{lesson.hints.length})
          </button>
        </div>
      )}

      <footer className="lesson-actions">
        <button onClick={runSetup} disabled={busy !== null} title="Prepara ficheros de ejemplo en tu home">
          📦 Preparar entorno
        </button>
        <button className="primary" onClick={runCheck} disabled={busy !== null}>
          {busy ? `⏳ ${busy}…` : `✔ Comprobar${currentTermId ? "" : " (necesitas una terminal)"}`}
        </button>
      </footer>

      {checks && (
        <div className={`check-report ${checks.every((c) => c.pass) ? "pass" : "fail"}`}>
          <h3>{checks.every((c) => c.pass) ? "¡Forjado! Pasaste todo 🎉" : "Aún no — revisa estos puntos"}</h3>
          <ul>
            {checks.map((c) => (
              <li key={c.id} className={c.pass ? "ok" : "ko"}>
                <span>{c.pass ? "✅" : "❌"} {c.name}</span>
                {!c.pass && (
                  <div className="ko-detail">
                    <code className="expected">esperado: {c.expected}</code>
                    <code className="got">obtuve: {c.got}</code>
                    {c.hint && <em>💡 {c.hint}</em>}
                  </div>
                )}
              </li>
            ))}
          </ul>
          {checks.every((c) => c.pass) && !done && (
            <button className="primary" onClick={() => onCompleted(lesson.id)}>
              🏆 Reclamar {lesson.xp} XP
            </button>
          )}
          {checks.every((c) => c.pass) && done && nextLesson && (
            <button className="primary go-next" onClick={() => onGoNext(nextLesson.id)}>
              Siguiente lección ▶ {nextLesson.title}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
