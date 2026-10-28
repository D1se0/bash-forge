import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CheckDetail, LessonContent, LessonMeta, ServerSessionMsg } from "@bashforge/shared";
import { ForgeWs, fetchLesson, fetchLessonList } from "./wsClient";
import { dispatchOutput, TermPane } from "./Terminal";
import { LessonPanel, Sidebar, flatOrder } from "./panels";
import { Cheatsheet } from "./cheatsheet-popup";
import type { LevelGroup } from "./catalog";
import { groupByLevel, isLevelLocked, unlockedLevel } from "./catalog";
import { isUnlockAll } from "./store";
import { currentTheme, toggleTheme } from "./theme";
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
  const [catalog, setCatalog] = useState<LessonMeta[]>([]);
  const [loaded, setLoaded] = useState<Map<string, LessonContent>>(new Map());
  const [current, setCurrent] = useState<string | null>(null);
  const [checks, setChecks] = useState<CheckDetail[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressSnapshot | null>(null);
  // ref para leer el progreso fresco dentro de callbacks con deps cortas
  const progressRef = useRef<ProgressSnapshot | null>(null);
  progressRef.current = progress;
  const [notice, setNotice] = useState<string | null>(null);
  const [fullterm, setFullterm] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [theme, setThemeState] = useState<string>(currentTheme());
  // lateral plegado/desplegado: persistido para no pelear con el usuario en cada recarga
  const [collapsed, setCollapsedState] = useState(() => {
    try {
      return localStorage.getItem("bf.sidebarCollapsed") === "1";
    } catch {
      return false;
    }
  });
  const setCollapsed = (v: boolean) => {
    setCollapsedState(v);
    try {
      localStorage.setItem("bf.sidebarCollapsed", v ? "1" : "0");
    } catch {
      /* modo privado: sin persistencia */
    }
  };

  const ws = wsRef.current;
  // workspace por nivel: al abrir una lección la terminal salta a $HOME/forja/nivel-N
  const cdLevelRef = useRef<number | null>(null);
  const pendingCdRef = useRef<string | null>(null);

  /** --------- modo foco: salir con Ctrl+Alt+F y desde el botón flotante --------- */
  const exitFocusRef = useRef(() => setFullterm(false));
  exitFocusRef.current = () => setFullterm(false);
  useEffect(() => {
    const onShortcuts = (e: KeyboardEvent) => {
      // captuta (capture phase): llega ANTES que los handlers internos de xterm
      if (e.ctrlKey && e.altKey && !e.shiftKey && (e.key === "F" || e.key === "f")) {
        e.preventDefault();
        e.stopPropagation();
        exitFocusRef.current();
      }
    };
    window.addEventListener("keydown", onShortcuts, true);
    return () => window.removeEventListener("keydown", onShortcuts, true);
  }, []);

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
      .then((metas) => {
        if (!Array.isArray(metas) || metas.length === 0) {
          setNotice("El servidor no expone lecciones; ejecuta `bashforge lessons`.");
          return;
        }
        setCatalog(metas);
        // precarga la primera lección del nivel 0 para que se vea contenido al abrir
        // abrimos la primera lección pedagógica real (no el boss ni un intermedio)
        // si la recarga es una REVISITA, retomamos la lección donde el alumno quedó
        const stored = localStorage.getItem("bf.currentLesson");
        const remembered = stored ? metas.find((m) => m.id === stored) : null;
        const first = remembered
          ?? metas.find((m) => m.id === "lvl0-que-es-un-shell")
          ?? metas.find((m) => m.level === 0 && m.kind === "lesson")
          ?? metas[0];
        void selectLessonRef.current(first.id);
      })
      .catch(() => setNotice("No pude cargar el catálogo: ¿servidor caído?"));
  }, []);

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
        // terminal nueva: aplica el cd pendiente del workspace del nivel activo
        if (pendingCdRef.current && s.terms.length) {
          const tid = s.terms[s.terms.length - 1];
          forgeWs.send({ type: "input", termId: tid, data: pendingCdRef.current });
          pendingCdRef.current = null;
        }
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
  // ref estable para que el efecto del catálogo pueda abrir la primera lección
  const selectLessonRef = useRef<(id: string) => void | Promise<void>>(async () => {});

  /** Importar un progreso exportado desde otra máquina: mismo local snapshot. */
  const importSnapshot = useCallback(
    (p: ProgressSnapshot | null) => {
      if (!p) {
        flash("⇩ Ese fichero no parece un progreso de Bash Forge (JSON con «completed»). Nada tocado.");
        return;
      }
      const forgeId = progressRef.current?.forgeId ?? p.forgeId;
      setProgress({ ...p, forgeId });
      ws.send({ type: "progress:save", snapshot: JSON.stringify({ ...p, forgeId }) });
      flash(`⇩ Progreso importado: ${p.completed.length} lecciones · ${p.xp} XP`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // pantalla completa de la terminal: la tecla ESC vuelve al layout normal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullterm(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selectLesson = useCallback(
    async (id: string) => {
      // candado por nivel: no se puede abrir una lección de un nivel bloqueado
      // (el modo avanzado «Desbloquear todo» lo ignora)
      const completed = progressRef.current?.completed ?? [];
      const lvl = catalog.find((m) => m.id === id)?.level ?? loaded.get(id)?.level;
      if (!isUnlockAll() && lvl != null && isLevelLocked(lvl, unlockedLevel(completed, groupsRef.current))) {
        flash(`🔒 Ese nivel sigue sellado: termina todas las lecciones del nivel ${lvl - 1} y se desbloqueará solo.`);
        return;
      }
      setCurrent(id);
      setChecks(null);
      try {
        const full = loaded.has(id) ? loaded.get(id)! : await fetchLesson<LessonContent>(id);
        setLoaded((m) => new Map(m).set(id, full));
        // recordar la lección al recargar la página
        try {
          localStorage.setItem("bf.currentLesson", id);
        } catch {
          /* modo privado */
        }
        // workspace por nivel: el shell salta a $HOME/forja/nivel-N al CAMBIAR de nivel;
        // el servidor ejecuta setup/check en ese mismo workspace, así todo queda en la carpeta del nivel
        if (typeof full.level === "number" && cdLevelRef.current !== full.level) {
          cdLevelRef.current = full.level;
          const cmd = `mkdir -p "$HOME/forja/nivel-${full.level}" && cd "$HOME/forja/nivel-${full.level}"\n`;
          const tid = activeTermRef.current;
          if (tid) ws.send({ type: "input", termId: tid, data: cmd });
          else pendingCdRef.current = cmd; // se aplica al crear la terminal nueva
        }
      } catch {
        flash(`No pude cargar la lección ${id}`);
      }
      window.dispatchEvent(new Event("bf-layout"));
    },
    [loaded],
  );
  selectLessonRef.current = selectLesson;

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

  // la barra lateral se alimenta del catálogo (metas); la lección abierta usa el detalle cargado
  const unified = useMemo<LessonContent[]>(() => {
    const metas = catalog as unknown as LessonContent[]; // LessonMeta llega de la API; el detalle es opcional
    const seen = new Set<string>([...loaded.keys(), ...metas.map((m) => m.id)]);
    return [...seen].map((id) => loaded.get(id) ?? metas.find((m) => m.id === id) ?? null).filter(Boolean) as LessonContent[];
  }, [catalog, loaded]);
  const groups: LevelGroup[] = useMemo(() => groupByLevel(unified), [unified]);
  // ref para que el guard de selectLesson vea los grupos sin re-crear el callback
  const groupsRef = useRef<LevelGroup[]>(groups);
  groupsRef.current = groups;

  const currentLesson = current ? loaded.get(current) ?? null : null;
  // siguiente paso del camino (ruta canónica): energiza «Continuar» en la sidebar y el panel
  const nextLesson = useMemo(() => {
    const route = flatOrder(groups);
    const completed = progress?.completed ?? [];
    return route.find((l) => !completed.includes(l.id)) ?? null;
  }, [groups, progress]);

  return (
    <div className={`app${fullterm ? " fullterm" : ""}${collapsed ? " plegado" : ""}`}>
      <header className="topbar">
        <span className="logo">🔥 Bash Forge</span>
        <span className="conn dot" data-ok={connected ? "yes" : "no"}>
          {connected ? "conectado" : "reconectando…"}
        </span>
        {session && <span className="session-info">🏠 {session.homeId}</span>}
        <button className="ghost" onClick={createTerm} title="Nueva terminal">＋ Terminal</button>
        <button
          className="ghost"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Desplegar el panel de niveles de nuevo" : "Plegar el panel de niveles (lateral izquierdo)"}
        >
          {collapsed ? "❯ Forja" : "❮ Plegar lateral"}
        </button>
        <button className="ghost" onClick={() => setSheetOpen(true)} title="Referencia completa de Bash (cheatsheet)">
          ᛜ Cheatsheet
        </button>
        <button
          className="ghost"
          onClick={() => setThemeState(toggleTheme())}
          title="Cambiar tema de interfaz (claro/oscuro)"
        >
          {theme === "dark" ? "☀ Día de Nieve" : "🌙 Noche de Fiordo"}
        </button>
        <button
          className="ghost"
          onClick={() => setFullterm((f) => !f)}
          title={fullterm ? "Volver al layout (ESC)" : "Terminal a pantalla completa"}
        >
          {fullterm ? "⤡ Volver" : "⛶ Pantalla completa"}
        </button>
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
          onImport={importSnapshot}
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
          <div
            className="term-host"
            id="term-host"
            onDoubleClick={() => setFullterm((f) => !f)}
          >
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
          nextLesson={nextLesson}
          onGoNext={selectLesson}
          done={current !== null && (progress?.completed.includes(current) ?? false)}
          onCompleted={claimXp}
          checks={checks}
          busy={busy}
          currentTermId={activeTerm}
        />
      </div>

      {notice && <div className="notice">{notice}</div>}

      {collapsed && (
        <button className="side-tab" onClick={() => setCollapsed(false)} title="Desplegar el panel de la forja">
          ◀ Forja
        </button>
      )}

      {sheetOpen && <Cheatsheet onClose={() => setSheetOpen(false)} />}

      {fullterm && (
        <div className="focusbar" role="toolbar" aria-label="Modo foco">
          <span className="focusbar-title">ᚲ Modo foco</span>
          <span className="focusbar-meta">solo terminal · el resto está fuera de la vista</span>
          <button className="primary" onClick={exitFocusRef.current} title="Volver al layout (Ctrl+Alt+F o doble clic)">
            ⤡ Salir del modo foco (Ctrl+Alt+F)
          </button>
        </div>
      )}
    </div>
  );
}

function mkForgeId(): string {
  const id = `forge_${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem("bf.forgeId", id);
  return id;
}
