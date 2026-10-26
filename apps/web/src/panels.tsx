import { useEffect, useMemo, useState } from "react";
import { markdownToHtml } from "./markdown";
import type { CheckDetail, LessonContent, ProgressSnapshot } from "@bashforge/shared";
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

export function Sidebar({ groups, progress, current, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="xp-block">
        <div className="xp-value">{progress.xp} XP</div>
        <div className="xp-meta">
          🔥 racha {progress.streak}d · ✅ {progress.completed.length} lecciones
        </div>
        <div className="badges-row">
          {BADGES.filter((b) => progress.badges.includes(b.id)).map((b) => (
            <span key={b.id} title={`${b.title}: ${b.description}`}>{b.icon}</span>
          ))}
        </div>
      </div>
      <nav className="lesson-tree">
        {groups.map((g) => (
          <details key={g.info.level} open className="level-group">
            <summary>
              <span className="lvl-badge">L{g.info.level}</span> {g.info.title}
            </summary>
            <ul>
              {g.lessons.map((l) => (
                <li key={l.id}>
                  <button
                    className={`lesson-link${current === l.id ? " current" : ""}${
                      progress.completed.includes(l.id) ? " done" : ""
                    }`}
                    onClick={() => onSelect(l.id)}
                    title={l.objective}
                  >
                    <span className="kind-icon">
                      {l.kind === "boss" ? "👹" : l.kind === "challenge" ? "⚔️" : "📘"}
                    </span>
                    {l.title}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        ))}
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
}

export function LessonPanel({ lesson, ws, done, onCompleted, checks, busy, currentTermId }: LessonPanelProps) {
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
        </div>
      )}
    </section>
  );
}
