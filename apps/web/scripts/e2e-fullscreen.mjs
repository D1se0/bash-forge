/**
 * E2E funcional con DevTools Protocol:
 * carga la app, pulsa el botón de pantalla completa, verifica la clase .fullterm,
 * pulsa ESC y verifica que vuelve. También pasa el smoke del catálogo.
 */
import { spawn } from "node:child_process";
import WebSocket from "ws";

const CHROME = process.env.CHROME_BIN ?? "chromium";
const PORT = 9333;
const chrome = spawn(CHROME, [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  `--remote-debugging-port=${PORT}`, "--user-data-dir=/tmp/bf-e2e-profile", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fail = (m) => { console.error(`✖ ${m}`); chrome.kill(); process.exit(1); };

try {
  // 1) endpoint del target
  let targets = null;
  for (let i = 0; i < 20 && !targets; i++) {
    await sleep(250);
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      targets = await r.json();
    } catch { /* aún no listo */ }
  }
  const page = targets?.find((t) => t.type === "page");
  if (!page) fail("no pude abrir la página de chrome");

  const cdp = new WebSocket(page.webSocketDebuggerUrl);
  let msgId = 0;
  const waiting = new Map();
  cdp.on("message", (raw) => {
    const m = JSON.parse(String(raw));
    if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); }
  });
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = ++msgId;
    waiting.set(id, resolve);
    cdp.send(JSON.stringify({ id, method, params }));
  });

  await new Promise((r) => cdp.on("open", r));
  await send("Page.enable");
  await send("Page.navigate", { url: "http://localhost:8080/" });

  // espera a que la app monte y cargue el catálogo
  let lessons = 0;
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    const r = await send("Runtime.evaluate", { expression: "document.querySelectorAll('.lesson-link').length" });
    lessons = Number(r.result?.result?.value ?? 0);
    if (lessons > 0) break;
  }
  if (lessons < 80) fail(`el catálogo no está completo (${lessons} links)`);
  console.log(`✔ catálogo: ${lessons} lecciones en la barra lateral`);

  // 2) botón de pantalla completa en la pestaña de la terminal (⛶)
  const r0 = await send("Runtime.evaluate", { expression: `
    document.querySelector('.term-actions button').click(); 'clicked'` });
  if (String(r0.result?.result?.value) !== "clicked") fail("no pude pulsar el botón ⛶");
  // React aplica el estado async: esperar un tick
  let afterClick = "";
  for (let i = 0; i < 10; i++) {
    await sleep(200);
    const r1 = await send("Runtime.evaluate", { expression: "document.querySelector('.app').className" });
    afterClick = String(r1.result?.result?.value ?? "");
    if (afterClick.includes("fullterm")) break;
  }
  if (!afterClick.includes("fullterm")) fail(`el clic en ⛶ no activa .fullterm (clase: ${afterClick})`);
  // el panel y la sidebar deben quedar ocultos
  const r1b = await send("Runtime.evaluate", { expression:
    "getComputedStyle(document.querySelector('.sidebar')).visibility" });
  if (String(r1b.result?.result?.value) !== "hidden") fail("la sidebar sigue visible en fullterm");
  console.log("✔ pantalla completa: .fullterm activa y paneles ocultos");

  // 3) ESC restauración
  await send("Runtime.evaluate", { expression: `
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); 'esc'` });
  let afterEsc = "";
  for (let i = 0; i < 10; i++) {
    await sleep(200);
    const r2 = await send("Runtime.evaluate", { expression: "document.querySelector('.app').className" });
    afterEsc = String(r2.result?.result?.value ?? "");
    if (!afterEsc.includes("fullterm")) break;
  }
  if (afterEsc.includes("fullterm")) fail("ESC no restaura el layout");
  console.log("✔ ESC restaura el layout normal");

  // 4) abrir otra lección de nivel 1 desde la sidebar
  const r3 = await send("Runtime.evaluate", { expression: `
    (() => {
      const links = [...document.querySelectorAll('.lesson-link')];
      const target = links.find(l => l.textContent.includes('Comillas'));
      if (!target) return 'no encontrada';
      target.click();
      return 'ok';
    })()` });
  await sleep(400);
  if (String(r3.result?.result?.value) !== "ok") fail("no pude abrir la lección lvl1 desde la sidebar");
  let opened = "";
  for (let i = 0; i < 20; i++) {
    await sleep(300);
    const r = await send("Runtime.evaluate", { expression: "document.querySelector('.lesson-panel')?.dataset.lesson ?? ''" });
    opened = String(r.result?.result?.value ?? "");
    if (opened.startsWith("lvl1")) break;
  }
  if (!opened.startsWith("lvl1")) fail(`la lección del nivel 1 no cargó (${opened})`);
  console.log(`✔ navegación: lección ${opened} montada`);
  console.log("✔ E2E completo en verde");
  chrome.kill();
  process.exit(0);
} catch (e) {
  fail(String(e));
}
