/** Paleta y tokens de diseño compartidos entre la SPA y la web de docs. */
export const BRAND = {
  name: "Bash Forge",
  tagline: "Aprende Bash de verdad, en una terminal real",
  colors: {
    /** Naranja forja (acento principal). */
    forge: "#f59e0b",
    forgeDark: "#b45309",
    /** Azul acero (secundario). */
    steel: "#38bdf8",
    /** Verde terminal de fondo en modo claro. */
    bgDark: "#0b0f19",
    bgPanel: "#111827",
    success: "#22c55e",
    danger: "#ef4444",
  },
  fontMonospace: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
} as const;

export * from "./protocol";
export * from "./lesson";
