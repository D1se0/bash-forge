import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";
import { THEME_DARK } from "./theme";
import type { ForgeWs } from "./wsClient";

export interface TerminalProps {
  termId: string;
  active: boolean;
  ws: ForgeWs;
  onFocusTerm: (id: string) => void;
}

/** Una PTY visual. Los datos llegan por WS (onOutput), escriben aquí. */
export function TermPane({ termId, active, ws, onFocusTerm }: TerminalProps) {
  const host = useRef<HTMLDivElement>(null);
  const xterm = useRef<Terminal | null>(null);
  const fit = useRef<FitAddon>(new FitAddon());

  // montaje: crear xterm, suscribir al output del WS
  useEffect(() => {
    const term = new Terminal({
      fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
      fontSize: 14,
      theme: THEME_DARK,
      cursorBlink: true,
      scrollback: 5000,
    });
    const f = fit.current;
    term.loadAddon(f);
    new WebLinksAddon().activate(term);
    term.open(host.current!);
    try {
      f.fit();
    } catch {
      /* layout sin tamaño aún */
    }
    xterm.current = term;
    term.onData((data) => ws.send({ type: "input", termId, data }));
    term.onResize(({ cols, rows }) => ws.send({ type: "resize", termId, cols, rows }));

    const off = subscribeOutput(termId, term);
    return () => {
      off();
      term.dispose();
      xterm.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termId]);

  // resize del contenedor
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      try {
        fit.current.fit();
      } catch {
        /* aún sin layout */
      }
    });
    ro.observe(host.current!);
    return () => ro.disconnect();
  }, []);

  // pulso de foco: cuando la pestaña está activa, el input va a aquí
  useEffect(() => {
    if (active) xterm.current?.focus();
  }, [active]);

  return (
    <div
      className={`term-pane${active ? " active" : ""}`}
      style={{ display: active ? "flex" : "none" }}
      onMouseDown={() => onFocusTerm(termId)}
      data-termid={termId}
      ref={host}
    />
  );
}

/** Puente WS→term. Cada TermPane registra su propio handler. */
const handlers = new Map<string, Array<{ write: (d: string) => void; unregister: () => void }>>();

/** Datos que llegaron con la pestaña desmontada (pestañas en background). */
const outputBuffer = new Map<string, string>();

export function dispatchOutput(termId: string, data: string): void {
  const list = handlers.get(termId);
  if (!list || list.length === 0) {
    const prev = outputBuffer.get(termId) ?? "";
    // límite defensivo: 512 KiB por pestaña
    outputBuffer.set(termId, (prev + data).slice(-524288));
    return;
  }
  for (const h of list) h.write(data);
}

function subscribeOutput(termId: string, term: Terminal): () => void {
  const entry = { write: (d: string) => term.write(d), unregister: () => {} };
  entry.unregister = () => {
    const arr = handlers.get(termId) ?? [];
    const i = arr.indexOf(entry);
    if (i >= 0) arr.splice(i, 1);
  };
  const arr = handlers.get(termId) ?? [];
  arr.push(entry);
  handlers.set(termId, arr);
  // drenar lo que llegó mientras no estábamos montados
  const buffered = outputBuffer.get(termId);
  if (buffered) {
    term.write(buffered);
    outputBuffer.delete(termId);
  }
  return entry.unregister;
}
