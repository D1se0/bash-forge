/**
 * Temas de terminal (xterm) + gestión del tema de interfaz.
 * El atributo data-theme vive en <html>; los tokens cambian en cascada.
 */

/* ------------------------------------------------------------------
 * Tema xterm «Nord» sobre la paleta del sistema de diseño:
 *  polar night  #2E3440 #3B4252 #434C5E #4C566A
 *  snow storm   #D8DEE9 #E5E9F0 #ECEFF4
 *  frost        #8FBCBB #88C0D0 #81A1C1 #5E81AC
 *  aurora       #BF616A #D08770 #EBCB8B #A3BE8C #B48EAD
 * ------------------------------------------------------------------ */
export const THEME_DARK = {
  background: "#20242e",
  foreground: "#d8dee9",
  cursor: "#88c0d0",
  cursorAccent: "#2e3440",
  selectionBackground: "#434c5e",
  black: "#2e3440", red: "#bf616a", green: "#a3be8c", yellow: "#ebcb8b",
  blue: "#81a1c1", magenta: "#b48ead", cyan: "#88c0d0", white: "#d8dee9",
  brightBlack: "#4c566a", brightRed: "#d08770", brightGreen: "#c5dae0",
  brightYellow: "#f2d8a5", brightBlue: "#93c6e0", brightMagenta: "#d8a7cc",
  brightCyan: "#a7dbe5", brightWhite: "#eceff4",
} as const;

/* Tema xterm claro «Día de Nieve» — fondos claros, acentos oscurecidos (AA) */
export const THEME_LIGHT = {
  background: "#eceff4",
  foreground: "#2e3440",
  cursor: "#345e8c",
  cursorAccent: "#eceff4",
  selectionBackground: "#d8dee9",
  black: "#3b4252", red: "#b3404c", green: "#47792b", yellow: "#946c00",
  blue: "#3a6ea5", magenta: "#87429c", cyan: "#1f768e", white: "#d8dee9",
  brightBlack: "#4c566a", brightRed: "#b3404c", brightGreen: "#4a7c2e",
  brightYellow: "#a3701e", brightBlue: "#345e8c", brightMagenta: "#87429c",
  brightCyan: "#20778f", brightWhite: "#2e3440",
} as const;

export type Theme = "dark" | "light";
const KEY = "bf.theme";

export function readStoredTheme(): Theme | null {
  const t = localStorage.getItem(KEY);
  return t === "dark" || t === "light" ? t : null;
}

export function systemTheme(): Theme {
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function currentTheme(): Theme {
  const t = document.documentElement.dataset.theme;
  return t === "light" || t === "dark" ? t : "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(KEY, theme);
}

/** decide tema al arrancar: preferencia guardada > sistema; default nórdico nocturno */
export function initTheme(): Theme {
  const theme = readStoredTheme() ?? systemTheme();
  document.documentElement.dataset.theme = theme;
  return theme;
}

export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
