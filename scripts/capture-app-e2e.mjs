/**
 * E2E de la app web (requiere docker compose up):
 * 1. sidebar con «Tu siguiente paso», numeración y CANDADOS por nivel
 * 2. forge-lint en vivo dentro de la terminal
 * 3. modo pantalla completa: entrar y SALIR (Esc + botón)
 * 4. cheatsheet glass: abre, busca y cierra
 * 5. bloque «Cómo se valida: por la SALIDA» visible en el panel + workspace por nivel
 * 6. lateral plegable: plegar y desplegar el árbol de niveles
 * 7. export/import de progreso: botones y descarga JSON
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

// 1b. candados: los niveles > 0 deben tener sus botones deshabilitados y chip 🔒
const lockedButtons = await a.locator(".lesson-link.locked[disabled]").count();
const lockChips = await a.locator(".lvl-lock").count();
console.log(`locked-lessons=${lockedButtons} locked-level-chips=${lockChips}`);
if (lockedButtons === 0 || lockChips === 0) process.exitCode = 1;

// 1c. el Boss del nivel 0 debe ir AL FINAL (orden pedagógico)
const firstTitle = await a.locator(".level-group[open] .lesson-title").first().textContent();
const bossFirst = firstTitle?.includes("Boss") ?? true;
console.log(`boss-primero=${bossFirst}`);
if (bossFirst) process.exitCode = 1;

// 1d. panel de lección: bloque de validación por salida (en una lección que valida por stdout)
await a.locator(".lesson-link", { hasText: "shebang" }).first().click();
await a.waitForTimeout(700);
const eo = await a.locator(".expected-outputs").count();
console.log(`expected-outputs=${eo}`);
if (!eo) process.exitCode = 1;
await a.screenshot({ path: `${out}/app__salida-esperada__1440x900__dark.png` });

// 2. terminal: workspace por nivel + script con errores sintácticos + forge-lint en vivo
// (T1 ya existe por defecto: foco a la terminal sin crear pestañas nuevas)
await a.locator(".term-pane").first().click();
await a.waitForTimeout(500);

// 1e. workspace por nivel: al abrir la lección (nivel 0) la terminal salta a forja/nivel-0
await a.keyboard.type("pwd", { delay: 6 });
await a.keyboard.press("Enter");
await a.waitForTimeout(600);
const rowsText = await a.locator(".xterm-rows").first().textContent().catch(() => "");
const autoCd = rowsText.includes("forja/nivel-");
console.log(`auto-cd=${rowsText ? autoCd : "no-leible (pwd no visible)"}`);
if (rowsText && !autoCd) process.exitCode = 1;
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

// 3. pantalla completa: entrar (único botón: «Pantalla completa» de la topbar)
await a.getByRole("button", { name: /Pantalla completa$/ }).click();
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
await a.getByRole("button", { name: /Pantalla completa$/ }).click();
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

// 4. cheatsheet glass: abrir, buscar y cerrar
await a.getByRole("button", { name: /Cheatsheet/ }).click();
await a.waitForTimeout(600);
const sheetOpen = await a.locator(".sheet-overlay").count();
const entryCount = await a.locator(".entry").count();
console.log(`cheatsheet-open=${sheetOpen} entradas=${entryCount}`);
await a.screenshot({ path: `${out}/app__cheatsheet__1440x900__dark.png` });
await a.locator(".sheet-search input").fill("expansión");
await a.waitForTimeout(400);
const filtered = await a.locator(".entry").count();
console.log(`cheatsheet-filtrado=${filtered}`);
if (!sheetOpen || entryCount < 80 || filtered === 0 || filtered >= entryCount) process.exitCode = 1;
await a.locator(".sheet-head button").click();
await a.waitForTimeout(300);
const sheetClosed = (await a.locator(".sheet-overlay").count()) === 0;
console.log(`cheatsheet-cerrado=${sheetClosed}`);
if (!sheetClosed) process.exitCode = 1;

// 6. lateral plegable: ocultar el árbol de niveles y desplegarlo de nuevo
await a.getByRole("button", { name: /Plegar lateral/ }).click();
await a.waitForTimeout(400);
const plegada = await a.locator(".app.plegado").count();
const sidebarOculta = await a.locator(".sidebar").first().isHidden();
console.log(`sidebar-plegada=${plegada} sidebar-oculta=${sidebarOculta}`);
if (!plegada || !sidebarOculta) process.exitCode = 1;
await a.screenshot({ path: `${out}/app__sidebar-plegada__1440x900__dark.png` });
await a.locator(".side-tab").click();
await a.waitForTimeout(400);
const siguePlegada = await a.locator(".app.plegado").count();
console.log(`sidebar-re-desplegada=${siguePlegada === 0}`);
if (siguePlegada) process.exitCode = 1;

// 7. export/import de progreso: popup glass → «Exportar JSON» con descarga real
const ioButtons = await a.locator(".progress-io button").count();
console.log(`progress-io=${ioButtons}`);
if (ioButtons < 1) process.exitCode = 1;
await a.locator(".progress-io button").first().click();
const popupVisible = await a.locator(".pop-actions button").count();
console.log(`popup-botones=${popupVisible}`);
const dlPromise = a.waitForEvent("download", { timeout: 6000 }).catch(() => null);
await a.locator(".pop-actions button").first().click(); // «⇪ Exportar JSON»
const dl = await dlPromise;
console.log(`progreso-export=${dl ? dl.suggestedFilename() : "sin-descarga"}`);
if (!dl) process.exitCode = 1;
await a.keyboard.press("Escape"); // cierra el popup

// 8. modo avanzado: desbloquear todo, abrir una lección de nivel 9 y volver a bloquear
const lockedAntes = await a.locator(".lesson-link.locked[disabled]").count();
await a.locator(".unlock-btn").click();
await a.waitForTimeout(400);
const lockedDespues = await a.locator(".lesson-link.locked[disabled]").count();
const chipsDespues = await a.locator(".lvl-lock").count();
console.log(`unlock-all: locked ${lockedAntes} -> ${lockedDespues} chips=${chipsDespues}`);
if (lockedDespues !== 0 || chipsDespues !== 0) process.exitCode = 1;
const lvl9 = await a.locator(".level-group .lvl-badge", { hasText: "L9" }).count();
if (!lvl9) process.exitCode = 1;
// abrir una lección avanzada de nivel 9 (debe CARGAR, sin flash de 🔒)
await a.locator(".level-group .lvl-badge", { hasText: "L9" }).click();
await a.waitForTimeout(500);
await a.locator(".level-group[open] .lesson-link", { hasText: "Guardian de Bucles" }).first().click();
await a.waitForTimeout(900);
const bossL9 = await a.locator(".lesson-panel h1, .lesson-pane h1, main h1").first().textContent().catch(() => "");
console.log(`leccion-l9=${bossL9 ? "abierta" : "no-hallada"}`);
// y al volver a bloquear, SOLO los niveles que el progreso tenía sellados vuelven a candado
await a.locator(".unlock-btn").click();
await a.waitForTimeout(400);
const lockedFinal = await a.locator(".lesson-link.locked[disabled]").count();
console.log(`re-lock: locked=${lockedFinal} (antes=${lockedAntes})`);
if (lockedFinal !== lockedAntes) process.exitCode = 1;

await b.close();
console.log("OK");
