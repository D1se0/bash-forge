import { useEffect, useMemo, useState } from "react";
import { markdownToHtml } from "./markdown";
import type { CheckDetail, LessonContent, LessonMeta, ProgressSnapshot } from "@bashforge/shared";
import { BADGES, LESSON_LEVELS } from "@bashforge/shared";
import type { ForgeWs } from "./wsClient";
import type { LevelGroup } from "./catalog";

/** ------------------------------------------------------------------ */
/** Barra lateral: árbol de niveles + progreso XP.                      */
/** ------------------------------------------------------------------ */

export interface SidebarProps {
  groups: LevelGroup[];
  progress: ProgressSnapshot;
  current: string | null;
  onSelect: (id: string) => void;
}

/** Orden canónico del currículum (nivel asc, luego id): la ruta de la forja. */
export function flatOrder(groups: LevelGroup[]): LessonMeta[] {
  return groups.flatMap((g) => g.lessons);
}

export function Sidebar({ groups, progress, current, onSelect }: SidebarProps) {
  const route = useMemo(() => flatOrder(groups), [groups]);
  const next = route.find((l) => !progress.completed.includes(l.id)) ?? null;
  const doneCount = route.filter((l) => progress.completed.includes(l.id)).length;
  const pct = route.length ? Math.round((doneCount / route.length) * 100) : 0;

  // niveles abiertos: todo lo anterior y el del siguiente paso (controlado, para no pelear con <details>)
  const [openLevels, setOpenLevels] = useState<Set<number>>(() => {
    const limit = next?.level ?? 0;
    return new Set(LESSON_LEVELS.filter((l) => l.level <= limit).map((l) => l.level));
  });
  const toggleLevel = (level: number, open: boolean) => {
    setOpenLevels((prev) => {
      const s = new Set(prev);
      if (open) s.add(level);
      else s.delete(level);
      return s;
    });
  };

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
          const done = g.lessons.filter((l) => progress.completed.includes(l.id)).length;
          return (
            <details
              key={g.info.level}
              className="level-group"
              open={openLevels.has(g.info.level)}
              onToggle={(e) => toggleLevel(g.info.level, (e.target as HTMLDetailsElement).open)}
            >
              <summary>
                <span className="lvl-badge">L{g.info.level}</span>
                <span className="lvl-name">{g.info.title}</span>
                <span className="lvl-progress" data-full={done === g.lessons.length ? "yes" : "no"}>
                  {done}/{g.lessons.length}
                </span>
              </summary>
              <ul>
                {g.lessons.map((l, i) => {
                  const done = progress.completed.includes(l.id);
                  const isNext = next?.id === l.id;
                  return (
                    <li key={l.id}>
                      <button
                        className={`lesson-link${current === l.id ? " current" : ""}${done ? " done" : ""}${isNext ? " next" : ""}`}
                        onClick={() => onSelect(l.id)}
                        title={l.objective}
                      >
                        <span className={`step-dot${done ? " done" : ""}${isNext ? " now" : ""}`}>
                          {done ? "✓" : String(i + 1)}
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
        })}
      </nav>
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
