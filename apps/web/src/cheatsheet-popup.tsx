import { useEffect, useMemo, useState } from "react";
import { CHEATSHEET } from "./cheatsheet";

/**
 * Popup de referencia completa de Bash: tarjeta glass con búsqueda,
 * secciones con runa y entradas término/firma/descripción/ejemplo.
 * Se cierra con Esc o clicando el fondo.
 */
export function Cheatsheet({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  // Esc cierra
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.stopPropagation();
      if (e.key === "Escape") onClose();
    };
    // capture para ganar al handler del modo foco de App
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  // si el modo foco dejaría capturar el teclado el popup coexiste: se separa por capas
  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return CHEATSHEET;
    return CHEATSHEET.map((s) => ({
      ...s,
      entries: s.entries.filter(
        (e) =>
          e.term.toLowerCase().includes(q) ||
          (e.sig ?? "").toLowerCase().includes(q) ||
          e.desc.toLowerCase().includes(q) ||
          (e.ex ?? "").toLowerCase().includes(q),
      ),
    })).filter((s) => s.entries.length > 0);
  }, [q]);

  const total = CHEATSHEET.reduce((n, s) => n + s.entries.length, 0);
  const found = filtered.reduce((n, s) => n + s.entries.length, 0);

  return (
    <div className="sheet-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Cheatsheet de Bash">
      <div className="sheet glass" onClick={(e) => e.stopPropagation()}>
        <header className="sheet-head">
          <span className="sheet-rune">ᛜ</span>
          <div>
            <h2>Cheatsheet de Bash</h2>
            <p>Referencia completa: {total} entradas en {CHEATSHEET.length} secciones · {found} visibles</p>
          </div>
          <button className="ghost" onClick={onClose} title="Cerrar (Esc)">✕</button>
        </header>

        <div className="sheet-search">
          <input
            autoFocus
            type="search"
            placeholder="busca: expansión, for, trap, ${var:-}, printf…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar en el cheatsheet"
          />
        </div>

        <div className="sheet-body">
          {filtered.map((s) => (
            <section key={s.id} className="sheet-section" id={`sheet-${s.id}`}>
              <h3><span className="ss-rune">{s.rune}</span> {s.title}</h3>
              {s.entries.map((e) => (
                <article key={e.term} className="entry">
                  <div className="entry-term">
                    <code>{e.term}</code>
                    {e.sig && <code className="entry-sig">{e.sig}</code>}
                  </div>
                  <p>{e.desc}</p>
                  {e.ex && <pre>{e.ex}</pre>}
                </article>
              ))}
            </section>
          ))}
          {found === 0 && <p className="sheet-empty">Sin resultados para «{query}». Prueba otro término.</p>}
        </div>

        <footer className="sheet-foot">
          <span>{CHEATSHEET.map((s) => (
            <a key={s.id} href={`#sheet-${s.id}`} onClick={() => setActive(s.id)} className={active === s.id ? "on" : ""}>
              {s.rune} {s.title.split(",")[0].split(" y ")[0]}
            </a>
          ))}</span>
          <span className="sheet-foot-hint">ᚲ Bash Forge · usa Esc para cerrar</span>
        </footer>
      </div>
    </div>
  );
}
