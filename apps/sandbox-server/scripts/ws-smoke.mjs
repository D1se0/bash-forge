// Smoke test del WS: sesion, PTY, echo y check de lección.
// Uso: node ws-smoke.mjs [ws://localhost:8020/ws]
import WebSocket from "ws";

const url = process.argv[2] ?? "ws://localhost:8020/ws";
const ws = new WebSocket(url);
let output = "";
let termId = null;
const failures = [];
const log = (s) => console.log(`· ${s}`);

ws.on("message", (raw) => {
  const m = JSON.parse(String(raw));
  if (m.type === "session") {
    log(`session: home=${m.homeId} terms=${m.terms.length}`);
    termId = m.terms[0] ?? null;
    if (!termId) ws.send(JSON.stringify({ type: "term:new" }));
    setTimeout(() => ws.send(JSON.stringify({ type: "input", termId, data: "echo forja-ok && whoami\n" })), 1500);
  }
  if (m.type === "output" && m.termId === termId) output += m.data;
  if (m.type === "term:exit") log(`term:exit ${m.termId} code=${m.exitCode}`);
  if (m.type === "error") failures.push(`${m.code}: ${m.message}`);
  if (m.type === "exercise:setup:result") log(`setup ${m.lessonId}: ${m.ok ? "OK" : "FAIL " + (m.stderr ?? "")}`);
  if (m.type === "exercise:result") {
    console.log("raw:", JSON.stringify(m).slice(0, 600));
    const failed = m.checks.filter((c) => !c.pass);
    log(`check ${m.lessonId}: pass=${m.pass} ${m.checks.length} aserciones (${failed.length} fallidas) en ${m.tookMs}ms`);
    for (const f of failed.slice(0, 5)) console.log(`   ✖ ${f.name} — ${f.got?.slice(0, 160)}`);
    ws.close();
    process.exit(m.pass && failures.length === 0 ? 0 : 1);
  }
});

ws.on("open", () => log("conectado"));
ws.on("close", (c) => log(`cerrado ${c}`));
ws.on("error", (e) => failures.push(`WS: ${e.message}`));

setTimeout(() => {
  let okEcho = false;
  // tras el echo; si salió, pide el setup + resuelve + check
  if (output.includes("forja-ok")) {
    okEcho = true;
    log(`terminal eco OK; usuario=${output.includes("forge_") ? "forge_*" : "?"}`);
    ws.send(JSON.stringify({ type: "exercise:setup", lessonId: "lvl0-shebang" }));
    // resolver la lección en la PTY (como haría el alumno)
    setTimeout(() => ws.send(JSON.stringify({
      type: "input",
      termId,
      data: "cat > hello.sh <<'X'\n#!/usr/bin/env bash\necho Hola desde Bash Forge\nX\nchmod +x hello.sh\n./hello.sh\n",
    })), 1500);
    // y ahora pedir el check
    setTimeout(() => ws.send(JSON.stringify({ type: "exercise:check", lessonId: "lvl0-shebang" })), 3500);
  }
  if (!okEcho && !output) console.error("✖ no recibí salida de la PTY");
}, 6000);

setTimeout(() => {
  console.error(`✖ timeout global. output=["${output.slice(-160)}"] errores=[${failures.join("; ")}]`);
  process.exit(1);
}, 30000);
