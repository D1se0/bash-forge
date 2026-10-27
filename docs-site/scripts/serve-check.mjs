/** Servidor de verificación para el build de docs-site bajo la base /bash-forge/ (como Pages). */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist");
const base = "/bash-forge/";
const mime = { ".html": "text/html", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".json": "application/json" };

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (!url.pathname.startsWith(base)) {
      res.writeHead(301, { Location: base });
      return res.end();
    }
    const rel = url.pathname.slice(base.length);
    const file = path.join(out, rel === "" ? "index.html" : rel);
    fs.readFile(file, (e, buf) => {
      if (e) {
        res.writeHead(404);
        return res.end("not found");
      }
      res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
      res.end(buf);
    });
  })
  .listen(8879, () => console.log("docs-site check: http://localhost:8879" + base));
