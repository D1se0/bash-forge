/**
 * Verifica el build de docs-site.como lo servirá Pages:
 * rutas 200 bajo /bash-forge/, fuentes cargadas y capturas del landing.
 * Uso: node scripts/capture-docssite.mjs  (requiere serve-check.mjs en 8879)
 */
import pw from "/usr/share/nodejs/playwright/index.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repo = path.resolve(root, "..");
const outDir = path.join(repo, "docs/evidence/06-redesign");
fs.mkdirSync(outDir, { recursive: true });
const base = "http://localhost:8879/bash-forge/";

// 1) rutas bajo la base: todo 200
for (const p of ["/", "/tokens.css", "/fonts.css", "/fonts/InterTight.latin.woff2", "/fonts/Fraunces.latin.woff2", "/fonts/JetBrainsMono.latin.woff2"]) {
  const res = await fetch(base + p.replace(/^\//, ""));
  console.log(res.status, p);
  if (res.status !== 200) process.exitCode = 1;
}

// 2) navegación real: fuentes + capturas
const { chromium } = pw;
const b = await chromium.launch({ executablePath: "/usr/bin/chromium" });
const a = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
await a.goto(base, { waitUntil: "networkidle" });
const fonts = await a.evaluate(async () => {
  await document.fonts.ready;
  return {
    inter: document.fonts.check("16px 'Inter Tight'"),
    fraunces: document.fonts.check("16px Fraunces"),
    mono: document.fonts.check("13px 'JetBrains Mono'"),
  };
});
console.log("fuentes:", JSON.stringify(fonts));
if (!fonts.inter || !fonts.fraunces || !fonts.mono) process.exitCode = 1;

await a.screenshot({ path: path.join(outDir, "docs-site__1440x900__dark__top.png") });
await a.evaluate(() => document.getElementById("caracteristicas")?.scrollIntoView());
await a.waitForTimeout(400);
await a.screenshot({ path: path.join(outDir, "docs-site__1440x900__dark__features.png") });
await a.evaluate(() => document.getElementById("nivel-2")?.scrollIntoView());
await a.waitForTimeout(400);
await a.screenshot({ path: path.join(outDir, "docs-site__1440x900__dark__mundos.png") });

// móvil
const m = await b.newPage({ viewport: { width: 390, height: 844 }, colorScheme: "dark" });
await m.goto(base, { waitUntil: "networkidle" });
await m.screenshot({ path: path.join(outDir, "docs-site__390x844__dark__top.png") });

await b.close();
console.log("OK capturas →", outDir);
