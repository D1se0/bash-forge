/**
 * Captura el editor nano con la sintaxis de colores de la forja, dentro de la
 * terminal real de la app (via WS → PTY del sandbox).
 * Uso: node scripts/capture-nano.mjs [salida.png]
 */
import pw from "/usr/share/nodejs/playwright/index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2] ?? path.join(root, "docs/evidence/06-redesign/nano-colores__1440x900__dark__es.png");

const { chromium } = pw;
const b = await chromium.launch({ executablePath: "/usr/bin/chromium" });
const a = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
await a.goto("http://localhost:8080/#/", { waitUntil: "networkidle" });
await a.waitForTimeout(1500);

// script de práctica que toca cada familia de token del nanorc
const lines = [
  "#!/usr/bin/env bash",
  "# practica de sintaxis — la forja",
  "set -euo pipefail",
  "",
  "nombre=$1",
  "if [ -f notas.txt ]; then",
  '  echo "hola ${nombre}, tu fichero existe"',
  "  for i in 1 2 3; do",
  "    echo $((i + 1))",
  "  done",
  "else",
  "  grep -R hola ./ 2>/dev/null | sort | uniq -c",
  "fi",
];
const script = lines.join("\n") + "\n";

// escribir el fichero con un heredoc (todo en una línea de terminal)
await a.keyboard.type(`cat > practica.sh <<'EOF'`, { delay: 8 });
await a.keyboard.press("Enter");
await a.waitForTimeout(120);
for (const line of lines) {
  // evitar que el shell cliente interprete nada: enviamos literal por teclado
  await a.keyboard.type(line, { delay: 4 });
  await a.keyboard.press("Enter");
}
await a.keyboard.type("EOF", { delay: 8 });
await a.keyboard.press("Enter");
await a.waitForTimeout(200);

await a.keyboard.type("nano practica.sh", { delay: 10 });
await a.keyboard.press("Enter");
await a.waitForTimeout(1000);
await a.screenshot({ path: out });
await b.close();
console.log("OK →", out);
