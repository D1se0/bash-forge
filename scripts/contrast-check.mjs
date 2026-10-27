#!/usr/bin/env node
/**
 * Verificador de contraste AA de los tokens del sistema de diseño.
 * Falla (exit 1) si cualquier par texto/fondo queda por debajo de 4.5:1
 * (3:1 para lo marcado como texto grande). Pares: tokens.css, ambos temas.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(path.join(root, "packages/ui/src/tokens.css"), "utf8");

/** extrae `prop: valor` del bloque correspondiente */
function block(marker) {
  const idx = css.indexOf(marker);
  if (idx < 0) return {};
  const start = css.indexOf("{", idx);
  let depth = 1, end = start + 1;
  while (depth > 0 && end < css.length) {
    if (css[end] === "{") depth++;
    if (css[end] === "}") depth--;
    end++;
  }
  return Object.fromEntries(
    [...css.slice(start + 1, end - 1).matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8}|[^;]+);/g)]
      .map((x) => [x[1], x[2].trim()]),
  );
}
const dark = block("color-scheme: dark");
const light = block('data-theme="light"');

function lum(hex) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(fg, bg) {
  const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** pares [nombre, fgToken, bgToken, mín] — -text = variante afín a AA para texto */
const pairs = (t) => [
  ["fg-strong/base", t["fg-strong"], t["bg-base"], 4.5],
  ["fg/base", t["fg"], t["bg-base"], 4.5],
  ["fg-muted/surface", t["fg-muted"], t["bg-surface"], 4.5],
  ["fg-faint/base", t["fg-faint"], t["bg-base"], 4.5],
  ["fg-faint/surface", t["fg-faint"], t["bg-surface"], 4.5],
  ["ice-2-text/base (enlaces)", t["ice-2-text"], t["bg-base"], 4.5],
  ["ice-1/surface (large/decorativa)", t["ice-1"], t["bg-surface"], 3],
  ["ember-text/base (texto brasa)", t["ember-text"], t["bg-base"], 4.5],
  ["ember/base (grande: CTA, iconos)", t["ember"], t["bg-base"], 3],
  ["ember-contrast/ember (texto CTA)", t["ember-contrast"], t["ember"], 4.5],
  ["aurora-g/base (éxito: iconos/fondos)", t["aurora-g"], t["bg-base"], 3],
  ["aurora-g-text/base (éxito texto)", t["aurora-g-text"], t["bg-base"], 4.5],
  ["aurora-r-text/base (error texto)", t["aurora-r-text"], t["bg-base"], 4.5],
  ["aurora-r/base (error grande)", t["aurora-r"], t["bg-base"], 3],
  ["aurora-v-text/base (XP)", t["aurora-v-text"], t["bg-base"], 4.5],
  ["aurora-v/base (logros grande)", t["aurora-v"], t["bg-base"], 3],
  ["aurora-y/base (aviso, grande)", t["aurora-y"], t["bg-base"], 3],
];

let fails = 0;
for (const [theme, t] of [["dark", dark], ["light", light]]) {
  for (const [name, fg, bg, min] of pairs(t)) {
    if (!fg || !bg || !fg.startsWith("#") || !bg.startsWith("#")) {
      console.error(`✖ ${theme}/${name}: token ausente o no-hex (fg=${fg}, bg=${bg})`);
      fails++;
      continue;
    }
    const r = ratio(fg, bg);
    const ok = r >= min;
    console.log(`${ok ? "✔" : "✖"} ${theme}/${name}: ${r.toFixed(2)}:1 (min ${min})`);
    if (!ok) fails++;
  }
}
if (fails) {
  console.error(`\nCONTRASTE: ${fails} par(es) por debajo del umbral — ajusta tokens.css`);
  process.exit(1);
}
console.log("\n✔ contraste AA completo en ambos temas");
