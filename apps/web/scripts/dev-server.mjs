/**
 * Dev server de la SPA: sirve estática y proxifica /ws y /api a sandbox-server.
 * Uso: node scripts/dev-server.mjs [sandboxPort] [webPort]
 */
import http from "node:http";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SANDBOX = Number(process.argv[2] ?? 8010);
const WEB = Number(process.argv[3] ?? 5173);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm" };

const server = http.createServer((req, res) => {
  if (req.url?.startsWith("/api/")) {
    const fwd = http.request({ host: "127.0.0.1", port: SANDBOX, path: req.url, method: req.method, headers: { ...req.headers, host: `127.0.0.1:${SANDBOX}` } },
      (r2) => { res.writeHead(r2.statusCode ?? 500, r2.headers); r2.pipe(res); });
    fwd.on("error", () => { res.writeHead(502); res.end("sandbox down"); });
    req.pipe(fwd);
    return;
  }
  let p = req.url?.split("?")[0] === "/" ? "/index.html" : req.url?.split("?")[0] ?? "/index.html";
  if (p === "/app.js" || p === "/styles.css" || p === "/index.html") p = p; // en dist/
  const file = path.join(root, p);
  if (!existsSync(file)) {
    res.writeHead(404); res.end("not found"); return;
  }
  res.writeHead(200, { "content-type": mime[path.extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

// Proxy WS: upgrade → sandbox
server.on("upgrade", (req, socket) => {
  const fwd = http.request({ host: "127.0.0.1", port: SANDBOX, path: req.url, method: "GET", headers: { ...req.headers, host: `127.0.0.1:${SANDBOX}` } });
  fwd.on("upgrade", (r2, s2, head) => {
    const lines = [`HTTP/1.1 101 Switching Protocols`];
    for (const [k, v] of Object.entries(r2.headers)) lines.push(`${k}: ${v}`);
    socket.write(lines.join("\r\n") + "\r\n\r\n");
    socket.write(head);
    s2.pipe(socket); socket.pipe(s2);
  });
  fwd.on("error", () => { socket.end(); });
  fwd.end();
});

server.listen(WEB, () => console.log(`web dev en http://localhost:${WEB} (sandbox :${SANDBOX})`));
