import { useCallback, useEffect, useRef, useState } from "react";
import type { CheckDetail, LessonContent, ServerSessionMsg } from "@bashforge/shared";
import { ForgeWs, fetchLesson, fetchLessonList } from "./wsClient";
import { dispatchOutput, TermPane } from "./Terminal";
import { LessonPanel, Sidebar } from "./panels";
import type { LevelGroup } from "./catalog";
import { groupByLevel } from "./catalog";
import {
  bumpStreak,
  computeBadges,
  loadProgress,
  saveProgress,
} from "./store";
import type { ProgressSnapshot } from "@bashforge/shared";
import { LESSON_LEVELS } from "@bashforge/shared";
import type { LessonLevel } from "@bashforge/shared";

/** extrae el nivel a partir de los datos cargados por id */
function levelOf(loaded: Map<string, LessonContent>): (id: string) => LessonLevel | null {
  return (id) => loaded.get(id)?.level ?? null;
}

interface Tab {
  id: string;
  title: string;
  exited: boolean;
}

export function App() {
  const wsRef = useRef<ForgeWs>(new ForgeWs());
  const [tab, setTabs] = useState<Tab[]>([]);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [session, setSession] = useState<ServerSessionMsg | null>(null);
  const [connected, setConnected] = useState(false);
  const [catalog, setCatalog] = useState<LessonContent[]>([]);
  const [loaded, setLoaded] = useState<Map<string, LessonContent>>(new Map());
  const [current, setCurrent] = useState<string | null>(null);
  const [checks, setChecks] = useState<CheckDetail[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressSnapshot | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const ws = wsRef.current;

  /** ------------- progreso ------------- */
  useEffect(() => {
    const forgeId = localStorage.getItem("bf.forgeId") ?? mkForgeId();
    setProgress(loadProgress(forgeId));
  }, []);

  useEffect(() => {
    if (progress) saveProgress(progress);
  }, [progress]);

  /** ------------- catálogo ------------- */
  useEffect(() => {
    fetchLessonList()
      .then(async (ids) => {
        setCatalog(
          ids.map((id) => stubMeta(id)).filter(Boolean) as LessonContent[],
        );
      })
      .catch(() => setNotice("No pude cargar el catálogo: ¿servidor caído?"));
    //IDER: solo metadatos básicos por id; el detalle se trae al hacer clic
  }, []);

  /** stub mínimo para renderizar la barra antes de traer detalle */
  function stubMeta(id: string): LessonContent {
    const m = /^lvl(\d+)-/.exec(id);
    const level = (m ? Number(m[1]) : 0) as LessonLevel;
    return {
      id,
      title: id.replace(/^lvl\d+-/, "").replaceAll("-", " "),
      level,
      kind: id.includes("-boss-") ? "boss" : id.includes("-reto-") ? "challenge" : "lesson",
      xp: 10,
      estimatedMinutes: 8,
      prerequisites: [],
      tags: [],
      objective: "",
      md: "",
      hints: [],
      validation: { mode: "declarative", timeoutSeconds: 10, tasks: [] },
    };
  }

  /** ------------- WS ------------- */
  useEffect(() => {
    const forgeWs = ws;
    forgeWs.connect({
      onOpen: () => {
        setConnected(true);
        forgeWs.restoreToken();
      },
      onClose: () => setConnected(false),
      onSession: (s) => {
        setSession(s);
        // crecer/encoger con la verdad del servidor (cada term:new resurgence aquí)
        setTabs((ts) => {
          const known = new Map(ts.map((t) => [t.id, t]));
          const next: Tab[] = s.terms.map((id, i) => known.get(id) ?? { id, title: `T${i + 1}`, exited: false });
          const stillThere = activeTermRef.current && s.terms.includes(activeTermRef.current);
          if (!stillThere) {
            setActiveTerm(s.terms.length ? s.terms[s.terms.length - 1] : null);
            activeTermRef.current = s.terms.length ? s.terms[s.terms.length - 1] : null;
          }
          return next;
        });
      },
      onOutput: (termId, data) => dispatchOutput(termId, data),
      onTermExit: (termId) => {
        setTabs((ts) => ts.map((t) => (t.id === termId ? { ...t, exited: true } : t)));
      },
      onCheckResult: (_lessonId, pass, list) => {
        setBusy(null);
        setChecks(list);
        if (pass) flash("¡Pasaste! 🎉 Reclama tu XP.");
      },
      onSetupResult: (_lessonId, ok, stderr) => {
        setBusy(null);
        flash(ok ? "Entorno preparado ✅" : `Setup falló: ${stderr ?? ""}`);
      },
      onProgress: (snapshotJson) => {
        try {
          const snapshot = JSON.parse(snapshotJson) as ProgressSnapshot;
          setProgress((p) => ({ ...(p ?? snapshot), ...snapshot }));
        } catch {
          /* snapshot inválido */
        }
      },
      onError: (code, message) => {
        if (code === "too_many_sessions") setNotice(message);
        else if (code === "session_expired") {
          forgeWs.forgetToken();
          location.reload();
        } else flash(message);
      },
    });
    return () => {
      if (forgeWs.pingTimer) clearInterval(forgeWs.pingTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ------------- selección de lección ------------- */
  const selectLesson = useCallback(
    async (id: string) => {
      setCurrent(id);
      setChecks(null);
      try {
        const full = loaded.has(id) ? loaded.get(id)! : await fetchLesson<LessonContent>(id);
        setLoaded((m) => new Map(m).set(id, full));
      } catch {
        flash(`No pude cargar la lección ${id}`);
      }
      window.dispatchEvent(new Event("bf-layout"));
    },
    [loaded],
  );

  function createTerm() {
    // el servidor crea la PTY y responde con un `session` que contiene el termId
    ws.send({ type: "term:new" });
  }

  function closeTerm(id: string) {
    ws.send({ type: "term:close", termId: id });
    setTabs((ts) => ts.filter((t) => t.id !== id));
    if (activeTermRef.current === id) {
      const rest = tab.filter((t) => t.id !== id);
      const next = rest.length ? rest[rest.length - 1].id : null;
      setActiveTerm(next);
      activeTermRef.current = next;
    }
  }

  const activeTermRef = useRef<string | null>(null);
  useEffect(() => {
    activeTermRef.current = activeTerm;
  }, [activeTerm]);

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  }

  function claimXp(lessonId: string) {
    const lesson = loaded.get(lessonId);
    if (!lesson || !progress || progress.completed.includes(lessonId)) return;
    const completed = [...progress.completed, lessonId];
    setProgress({
      ...progress,
      completed,
      xp: progress.xp + lesson.xp,
      streak: bumpStreak(progress),
      badges: computeBadges(completed, levelOf(loaded)),
    });
    flash(`+${lesson.xp} XP 🏆`);
    ws.send({
      type: "progress:save",
      snapshot: JSON.stringify({ ...progress, completed, xp: progress.xp + lesson.xp }),
    });
  }

  const groups: LevelGroup[] = groupByLevel(loaded.size > 0 ? [...loaded.values()] : [...stubbedCatalog()]);
  function stubbedCatalog(): LessonContent[] {
    return catalog;
  }

  const currentLesson = current ? loaded.get(current) ?? null : null;

  return (
    <div className="app">
      <header className="topbar">
        <span className="logo">🔥 Bash Forge</span>
        <span className="conn dot" data-ok={connected ? "yes" : "no"}>
          {connected ? "conectado" : "reconectando…"}
        </span>
        {session && <span className="session-info">🏠 {session.homeId}</span>}
        <button className="ghost" onClick={createTerm}>＋ Terminal</button>
        <button
          className="ghost"
          onClick={() => {
            if (confirm("¿Borrar tu home del sandbox y empezar de cero?")) {
              ws.send({ type: "session:reset" });
              flash("Sesión reiniciada");
            }
          }}
        >
          ♻ Reset home
        </button>
      </header>

      <div className="main">
        <Sidebar
          groups={groups}
          progress={progress ?? { forgeId: "", completed: [], xp: 0, badges: [], lastActiveDate: null, streak: 0, theme: "dark", lang: "es" }}
          current={current}
          onSelect={selectLesson}
        />

        <div className="center">
          <div className="tabs">
            {tab.map((t) => (
              <div
                key={t.id}
                className={`tab${activeTerm === t.id ? " active" : ""}`}
                onClick={() => setActiveTerm(t.id)}
              >
                <span>
                  {t.title} {t.exited ? "(fin)" : ""}
                </span>
                <button className="tab-close" onClick={(e) => { e.stopPropagation(); closeTerm(t.id); }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="term-host" id="term-host">
            {tab.map((t) => (
              <TermPane
                key={t.id}
                termId={t.id}
                active={activeTerm === t.id}
                ws={ws}
                onFocusTerm={setActiveTerm}
              />
            ))}
            {tab.length === 0 && <p className="empty-term">Sin terminales; crea una con ＋ Terminal.</p>}
          </div>
        </div>

        <LessonPanel
          lesson={currentLesson}
          ws={ws}
          done={current !== null && (progress?.completed.includes(current) ?? false)}
          onCompleted={claimXp}
          checks={checks}
          busy={busy}
          currentTermId={activeTerm}
        />
      </div>

      {notice && <div className="notice">{notice}</div>}
    </div>
  );
}

function mkForgeId(): string {
  const id = `forge_${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem("bf.forgeId", id);
  return id;
}
