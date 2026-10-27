/**
 * E2E de la app web (requiere docker compose up):
 * 1. sidebar nueva con «Tu siguiente paso» + numeración
 * 2. forge-lint en vivo dentro de la terminal
 * 3. modo pantalla completa: entrar y SALIR (Esc + botón)
 * Captura evidencia a docs/evidence/06-redesign/.
 */
import pw from "/usr/share/nodejs/playwright/index.js";
const { chromium } = pw;

const out = "docs/evidence/06-redesign";
const b = await chromium.launch({ executablePath: "/usr/bin/chromium" });
const a = await b.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });

await a.goto("http://localhost:8080/#/", { waitUntil: "networkidle" });
await a.waitForTimeout(1800);

// 1. sidebar con siguiente paso
const nextCard = await a.locator(".next-card").count();
const stepDots = await a.locator(".step-dot").count();
const levelGroups = await a.locator(".level-group").count();
console.log(`next-card=${nextCard} step-dots=${stepDots} level-groups=${levelGroups}`);
if (!nextCard || !stepDots || levelGroups < 9) process.exitCode = 1;
await a.screenshot({ path: `${out}/app__sidebar__1440x900__dark.png` });

// 2. terminal: script con errores sintácticos + forge-lint en vivo
// (T1 ya existe por defecto: foco a la terminal sin crear pestañas nuevas)
await a.locator(".term-pane").first().click();
await a.waitForTimeout(500);
const bad = [
  "#!/usr/bin/env bash",
  "nombre = \"kali\"",
  "if [ -f /etc/passwd ]; then",
  'echo "hola ${nombre}"',
  "else",
  "echo falta fi",
];
await a.keyboard.type("cat > roto.sh <<'EOF'", { delay: 6 });
await a.keyboard.press("Enter");
for (const line of bad) {
  await a.keyboard.type(line, { delay: 3 });
  await a.keyboard.press("Enter");
}
await a.keyboard.type("EOF", { delay: 6 });
await a.keyboard.press("Enter");
await a.keyboard.type("forge-lint roto.sh", { delay: 6 });
await a.keyboard.press("Enter");
await a.waitForTimeout(1200);
await a.screenshot({ path: `${out}/app__forge-lint__1440x900__dark.png` });

// 3. pantalla completa: entrar
await a.locator("term-actions button, .term-actions button").first().click();
await a.waitForTimeout(700);
const fullOn = await a.locator(".app.fullterm").count();
console.log(`fullterm-on=${fullOn}`);
await a.screenshot({ path: `${out}/app__fullterm-on__1440x900__dark.png` });

// salir con ESC (el overlay + ESC debe devolver el layout)
await a.keyboard.press("Escape");
await a.waitForTimeout(700);
const fullOff = await a.locator(".app.fullterm").count();
console.log(`fullterm-off=${fullOff}`);
if (fullOff) process.exitCode = 1;
await a.screenshot({ path: `${out}/app__fullterm-off__1440x900__dark.png` });

// reentrar y salir desde el botón flotante de la focusbar
await a.locator(".term-actions button").first().click();
await a.waitForTimeout(600);
const exitBtn = a.locator(".focusbar button");
if (await exitBtn.count()) {
  await exitBtn.click();
  await a.waitForTimeout(500);
  const stillFull = await a.locator(".app.fullterm").count();
  console.log(`fullterm-off-via-button=${stillFull === 0}`);
  if (stillFull) process.exitCode = 1;
} else {
  console.log("focusbar no visible");
  process.exitCode = 1;
}

await b.close();
console.log("OK");
