import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BADGES, LESSON_LEVELS } from "@bashforge/shared";
import type { LessonLevel, ProgressSnapshot } from "@bashforge/shared";
import type { LevelGroup, TrackGroup } from "./catalog";
import { ChangeEvent } from "react";

/**
 * Popup glass con el progreso de la forja: resumen de estadísticas,
 * exportar/importar JSON (migración entre máquinas) y PDF profesional
 * con el informe completo (impresión del navegador → Guardar como PDF).
 */
export interface ProgressPopupProps {
  groups: LevelGroup[];
  /** Pista de práctica dirigida (IF, FOR, …): se informa en stats, popup y PDF. */
  practice: TrackGroup[];
  progress: ProgressSnapshot;
  onClose: () => void;
  /** Importar un snapshot validado (App lo persiste y avisa); null = fichero inválido. */
  onImport: (p: ProgressSnapshot | null) => void;
}

export function ProgressPopup({ groups, practice, progress, onClose, onImport }: ProgressPopupProps) {
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    // capture para ganar al handler del modo foco
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const stats = useMemo(() => {
    const completed = progress.completed;
    const total = groups.reduce((n, g) => n + g.lessons.length, 0);
    const perLevel = groups.map((g) => {
      const done = g.lessons.filter((l) => completed.includes(l.id)).length;
      return { level: g.info.level, title: g.info.title, done, total: g.lessons.length };
    });
    // práctica dirigida: progresión propia, fuera del % del camino
    const perTrack = practice.map((t) => ({
      track: t.track,
      title: t.title,
      done: t.lessons.filter((l) => completed.includes(l.id)).length,
      total: t.lessons.length,
    }));
    const donePath = perLevel.reduce((n, l) => n + l.done, 0);
    const donePract = perTrack.reduce((n, l) => n + l.done, 0);
    return {
      total,
      perLevel,
      perTrack,
      pct: total ? Math.round((donePath / total) * 100) : 0,
      donePath,
      donePract,
      totalPract: practice.reduce((n, t) => n + t.lessons.length, 0),
    };
  }, [groups, practice, progress.completed]);

  /** Exporta el progreso como JSON descargable (mismo formato que siempre). */
  function exportJson(): void {
    const payload = {
      app: "bashforge",
      version: 1,
      exportedAt: new Date().toISOString(),
      progress,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url;
    el.download = `bashforge-progreso-${progress.forgeId || "local"}-${new Date().toISOString().slice(0, 10)}.json`;
    el.click();
    URL.revokeObjectURL(url);
    setFlash({ ok: true, text: "⇪ Progreso descargado (JSON)" });
  }

  /** Importa un JSON exportado con validación mínima (misma tolerancia que la barra antigua). */
  async function importJson(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as { progress?: ProgressSnapshot } & Partial<ProgressSnapshot>;
      const p = parsed.progress ?? parsed;
      if (!p || typeof p !== "object" || !Array.isArray(p.completed)) {
        throw new Error("formato no reconocido");
      }
      const isStrArr = (a: unknown): a is string[] => Array.isArray(a) && a.every((s) => typeof s === "string");
      onImport({
        ...progress,
        completed: isStrArr(p.completed) ? p.completed : progress.completed,
        xp: typeof p.xp === "number" ? p.xp : progress.xp,
        badges: isStrArr(p.badges) ? p.badges : progress.badges,
        streak: typeof p.streak === "number" ? p.streak : progress.streak,
        lastActiveDate: typeof p.lastActiveDate === "string" ? p.lastActiveDate : progress.lastActiveDate,
      });
      setFlash({ ok: true, text: "✓ Progreso importado" });
    } catch {
      onImport(null); // fichero inválido: la app lo avisa
      setFlash({ ok: false, text: "✕ Ese fichero no es un progreso de Bash Forge" });
    }
  }

  /** PDF: informe con la estética de la app maquetada para A4. */
  function exportPdf(): void {
    const w = window.open("", "_blank", "width=820,height=1000");
    if (!w) {
      setFlash({ ok: false, text: "✕ El navegador bloqueó la ventana del PDF" });
      return;
    }
    const now = new Date();
    const fecha = now.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
    const badges = BADGES.filter((b) => progress.badges.includes(b.id));
    const niveles = stats.perLevel
      .map(
        (l) => `
        <div class="lvl-row">
          <span class="lvl-n">L${l.level}</span>
          <span class="lvl-t">${esc(l.title)}</span>
          <div class="lvl-bar"><div class="lvl-fill" style="width:${l.total ? Math.round((l.done / l.total) * 100) : 0}%"></div></div>
          <span class="lvl-c">${l.done}/${l.total}</span>
        </div>`,
      )
      .join("");
    const badgeTags = badges.length
      ? badges.map((b) => `<span class="chip">${b.icon} ${esc(b.title)}</span>`).join(" ")
      : `<span class="chip vacio">— aún sin insignias: Completa lecciones para encenderlas</span>`;
    const praRows = stats.perTrack
      .map(
        (t) => `
        <div class="lvl-row">
          <span class="lvl-n pra-n">${esc(t.track)}</span>
          <span class="lvl-t">${esc(t.title)}</span>
          <div class="lvl-bar"><div class="lvl-fill pra" style="width:${t.total ? Math.round((t.done / t.total) * 100) : 0}%"></div></div>
          <span class="lvl-c">${t.done}/${t.total}</span>
        </div>`,
      )
      .join("");
    const praSec = stats.totalPract
      ? `
        <div class="sec">
          <h2>Práctica dirigida</h2>
          ${praRows}
        </div>`
      : "";
    const ruta = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Bash Forge · informe de progreso</title><style>
        @page { margin: 0; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: ui-sans-serif, system-ui, "Segoe UI", Helvetica, Arial, sans-serif; color: #e8eef7; background: #0b1220; }
        .page { max-width: 780px; margin: 0 auto; padding: 48px 54px 40px; }
        .cover { border-radius: 18px; background: linear-gradient(150deg, #12203a, #0b1220 65%); border: 1px solid rgba(126,180,236,.35); padding: 34px 38px; }
        .logo { font-size: 17px; font-weight: 800; letter-spacing: 6px; color: #9cc2f5; text-transform: uppercase; }
        .logo::after { content: ""; display: block; width: 48px; height: 3px; margin-top: 7px; background: linear-gradient(90deg, #7ea4ec, transparent); border-radius: 2px; }
        h1 { margin: 10px 0 4px; font-size: 26px; letter-spacing: .4px; color: #f2f6ff; }
        .sub { color: #8ea3c0; font-size: 13px; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
        .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 26px 0 8px; }
        .kpi { background: #101a2e; border: 1px solid rgba(126,180,236,.22); border-radius: 14px; padding: 16px 14px; }
        .kpi-v { font-size: 24px; font-weight: 760; color: #9cc2f5; }
        .kpi-l { margin-top: 4px; font-size: 11px; letter-spacing: 1.1px; text-transform: uppercase; color: #8ea3c0; }
        .sec { margin-top: 30px; }
        .sec h2 { font-size: 14px; letter-spacing: 1.6px; text-transform: uppercase; color: #9cc2f5; border-bottom: 1px solid rgba(126,180,236,.25); padding-bottom: 8px; margin: 0 0 14px; }
        .lvl-row { display: flex; align-items: center; gap: 12px; padding: 7px 10px; background: #101a2e; border: 1px solid rgba(126,180,236,.18); border-radius: 12px; margin: 8px 0; }
        .lvl-n { font-family: ui-monospace, Menlo, monospace; font-weight: 700; color: #9cc2f5; min-width: 30px; }
        .lvl-t { flex: 1; font-size: 13.5px; color: #dce6f5; }
        .lvl-bar { width: 180px; height: 7px; background: #0b1220; border-radius: 4px; overflow: hidden; border: 1px solid rgba(126,180,236,.25); }
        .lvl-fill { height: 100%; background: linear-gradient(90deg, #7ea4ec, #9cc2f5); }
        .lvl-fill.pra { background: linear-gradient(90deg, #8fbcbb, #a3be8c); }
        .lvl-n.pra-n { color: #a3e2cd; border: 1px solid rgba(163,226,205,.4); border-radius: 8px; padding: 1px 8px; font-size: 10.5px; text-align: center; }
        .lvl-c { font-family: ui-monospace, Menlo, monospace; font-size: 12px; color: #8ea3c0; min-width: 44px; text-align: right; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip { background: #101a2e; border: 1px solid rgba(126,180,236,.3); color: #dce6f5; border-radius: 999px; padding: 5px 14px; font-size: 12.5px; }
        .chip.vacio { color: #8ea3c0; border-style: dashed; }
        .foot { margin-top: 34px; color: #8ea3c0; font-size: 11.5px; font-family: ui-monospace, Menlo, monospace; display: flex; justify-content: space-between; }
        @media print { body { background: #0b1220; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { padding: 30px 40px; } }
      </style></head><body><div class="page">
        <div class="cover">
          <div class="logo">BASH FORGE</div>
          <h1>Informe de progreso · Bash Forge</h1>
          <div class="sub">alumno ${esc(progress.forgeId || "forja-local")} · generado el ${fecha}</div>
          <div class="kpis">
            <div class="kpi"><div class="kpi-v">${progress.xp}</div><div class="kpi-l">XP de la forja</div></div>
            <div class="kpi"><div class="kpi-v">${progress.streak}</div><div class="kpi-l">racha (días)</div></div>
            <div class="kpi"><div class="kpi-v">${progress.completed.length}/${stats.total}</div><div class="kpi-l">lecciones</div></div>
            <div class="kpi"><div class="kpi-v">${stats.pct}%</div><div class="kpi-l">camino recorrido</div></div>
          </div>
        </div>
        <div class="sec">
          <h2>El camino nivel a nivel</h2>
          ${niveles}
        </div>${praSec}
        <div class="sec">
          <h2>Insignias conquistadas</h2>
          <div class="chips">${badgeTags}</div>
        </div>
        <div class="foot">
          <span>ᚲ Bash Forge · forja de la línea de comandos</span>
          <span>${fecha}</span>
        </div>
      </div>
      <script>window.onload = () => setTimeout(() => window.print(), 250);</script>
      </body></html>`;
    w.document.open();
    w.document.write(ruta);
    w.document.close();
    setFlash({ ok: true, text: "⇪ PDF listo: usa «Guardar como PDF» en el diálogo de impresión" });
  }

  return createPortal(
    <div className="sheet-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Progreso de la forja">
      <div className="sheet pop glass" onClick={(e) => e.stopPropagation()}>
        <header className="sheet-head">
          <span className="sheet-rune">ᛪ</span>
          <div>
            <h2>Tu progreso en la forja</h2>
            <p>exporta · importa · imprimible en PDF</p>
          </div>
          <button className="ghost" onClick={onClose} title="Cerrar (Esc)">✕</button>
        </header>

        <div className="pop-stats">
          <div className="kpi"><span className="kpi-v">{progress.xp}</span><span className="kpi-l">XP</span></div>
          <div className="kpi"><span className="kpi-v">🔥 {progress.streak}</span><span className="kpi-l">racha</span></div>
          <div className="kpi"><span className="kpi-v">{progress.completed.length}/{stats.total}</span><span className="kpi-l">lecciones</span></div>
          <div className="kpi"><span className="kpi-v">{stats.pct}%</span><span className="kpi-l">camino</span></div>
        </div>

        <div className="pop-levels">
          {stats.perLevel.map((l) => (
            <div className="lvl-row" key={l.level}>
              <span className="pop-lvl">L{l.level}</span>
              <span className="pop-lvl-title">{l.title}</span>
              <span className="pop-lvl-count">
                {l.done}/{l.total}
              </span>
            </div>
          ))}
          {stats.perTrack.map((t) => (
            <div className="lvl-row pra" key={t.track}>
              <span className="pop-lvl pra">{t.track}</span>
              <span className="pop-lvl-title">{t.title}</span>
              <span className="pop-lvl-count">
                {t.done}/{t.total}
              </span>
            </div>
          ))}
        </div>

        {flash && <div className={`pop-flash${flash.ok ? " ok" : ""}`}>{flash.text}</div>}

        <footer className="pop-actions">
          <button onClick={exportJson} title="Descarga tu progreso como JSON para migrarlo a otra máquina">⇪ Exportar JSON</button>
          <button onClick={() => fileRef.current?.click()} title="Sube un JSON exportado desde otra máquina">⇩ Importar JSON</button>
          <button className="primario" onClick={exportPdf} title="Abre el informe listo para Guardar como PDF">🖨 Exportar PDF</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importJson} />
        </footer>
        <p className="pop-hint">ᚲ El PDF se abre en una pestaña lista para imprimir → «Guardar como PDF».</p>
      </div>
    </div>,
    document.body,
  );
}

function esc(s: string | string[]): string {
  const text = typeof s === "string" ? s : s.join(" ");
  return text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);
}
