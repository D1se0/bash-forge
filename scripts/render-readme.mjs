/**
 * Renderiza README.md a HTML con estilos tipo GitHub (claro/oscuro) para revisar
 * el escaparate del repo como markdown de producto — sin depender de GitHub.
 * Uso: node scripts/render-readme.mjs  → /tmp/readme-<tema>.html
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const md = fs.readFileSync(path.join(root, "README.md"), "utf8");
const body = marked.parse(md);

const css = (dark) => `<style>
  body { background: ${dark ? "#0d1117" : "#ffffff"}; color: ${dark ? "#e6edf3" : "#1f2328"};
    font: 16px/1.6 -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 0 auto; padding: 28px 32px; }
  img { max-width: 100%; }
  table { border-collapse: collapse; }
  th, td { border: 1px solid ${dark ? "#30363d" : "#d0d7de"}; padding: 6px 13px; }
  code { background: ${dark ? "#161b22" : "#f6f8fa"}; border-radius: 6px; padding: 2px 6px; font-family: ui-monospace, monospace; font-size: 85%; }
  pre { background: ${dark ? "#161b22" : "#f6f8fa"}; border-radius: 6px; padding: 16px; }
  a { color: ${dark ? "#4493f8" : "#0969da"}; }
  blockquote { border-left: 4px solid #d0d7de; color: #656d76; margin: 0; padding-left: 16px; }
  hr { border: 0; border-top: 1px solid ${dark ? "#30363d" : "#d0d7de"}; }
  details { border: 1px solid #30363d; border-radius: 8px; padding: 8px 12px; margin: 8px 0; }
  summary { cursor: pointer; font-weight: 600; }
</style>`;

for (const dark of [true, false]) {
  // base hacia el repo: las rutas relativas (docs/assets/…) resuelven aunque el HTML viva en /tmp
  const html = `<!doctype html><meta charset=utf-8><base href="file://${root}/"><title>README pretty</title>${css(dark)}<body>${body}`;
  fs.writeFileSync(`/tmp/readme-${dark ? "dark" : "light"}.html`, html);
}
console.log("✔ /tmp/readme-dark.html + /tmp/readme-light.html");
