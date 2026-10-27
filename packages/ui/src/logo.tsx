/**
 * Logo Bash Forge: yunque estilizado (silueta geométrica) + runa Kenaz ᚲ
 * como antorcha de la forja. Variantes: dark (por defecto), light, mono.
 * Todo trazo/fill usa currentColor salvo la brasa (--ember).
 *
 * createElement explícito: el paquete se compila sin el tsconfig de la app.
 */
import { createElement as h, type CSSProperties } from "react";
import { Rune } from "./runes";

export interface LogoProps {
  size?: number;
  variant?: "dark" | "light" | "mono";
  showWordmark?: boolean;
  style?: CSSProperties;
  className?: string;
}

const MARK: Record<NonNullable<LogoProps["variant"]>, { metal: string; ember: string; fg: string }> = {
  dark: { metal: "#4c566a", ember: "var(--ember)", fg: "var(--fg-strong)" },
  light: { metal: "#9aa5b8", ember: "var(--ember)", fg: "var(--fg-strong)" },
  mono: { metal: "currentColor", ember: "currentColor", fg: "currentColor" },
};

/** yunque: cuerno derecho + cara + pie; kenaz incrustado en la cara */
export function AnvilMark({ size = 40, variant = "dark", style, className }: Omit<LogoProps, "showWordmark">) {
  const m = MARK[variant];
  return h(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      className,
      style,
      role: "img",
      "aria-label": "Bash Forge",
    },
    h("path", {
      d: "M12 34 H64 C78 34 88 42 92 50 C86 52 78 54 68 54 H60 L62 64 C74 68 80 74 82 80 H18 C20 74 26 68 38 64 L40 54 H20 C8 54 6 42 12 34 Z",
      fill: m.metal,
    }),
    // ojo de la runa: escote donde se incrusta kenaz (brasa)
    h("circle", { cx: "50", cy: "43", r: "12.5", fill: "var(--bg-base, #2e3440)" }),
  );
}

export function Logo({ size = 28, variant = "dark", showWordmark = true, style, className }: LogoProps) {
  return h(
    "span",
    {
      className: ["bf-logo", className ?? ""].filter(Boolean).join(" "),
      style: { display: "inline-flex", alignItems: "center", gap: size * 0.28, ...style },
    },
    h(
      "span",
      { key: "mark", style: { position: "relative", display: "inline-flex", width: size, height: size } },
      h(AnvilMark, { size, variant }),
      // kenaz ᚲ en brasa, incrustado en el ojo del yunque
      h(
        "span",
        {
          style: {
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: MARK[variant].ember,
          },
        },
        h(Rune, { name: "kenaz", size: size * 0.32, variant: "glow" }),
      ),
    ),
    showWordmark
      ? h(
          "span",
          {
            key: "word",
            style: {
              fontFamily: "var(--font-serif)",
              fontWeight: 560,
              fontSize: size * 0.66,
              letterSpacing: "0.2px",
              color: MARK[variant].fg,
              lineHeight: 1,
            },
          },
          "Bash Forge",
        )
      : null,
  );
}
