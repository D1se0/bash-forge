/**
 * Runas del Futhark Antiguo como SVG trazado a mano (viewBox 0 0 100 170).
 * Una runa por categoría de lección, insignia y acción clave (DESIGN.md §Iconografía).
 * variant: outline (perfil fino) · fill (golpe de martillo, grueso) · glow (resplandor).
 *
 * Nota técnica: este paquete se compila desde node_modules, donde no se aplica el
 * tsconfig de la app; usamos createElement explícito para no depender del runtime JSX.
 */
import { createElement as h, type CSSProperties, type ReactNode } from "react";

/** polilíneas por runa: cada elemento es una línea independiente de puntos [x,y] */
export const RUNES: Record<string, number[][][]> = {
  fehu:    [[[40, 12], [40, 158]], [[40, 52], [70, 30]], [[40, 88], [70, 66]]],
  uruz:    [[[28, 152], [28, 40], [62, 14], [62, 152]]],
  thurisaz: [[[42, 12], [42, 158]], [[42, 48], [72, 86], [42, 124], [42, 48]]],
  ansuz:   [[[36, 12], [36, 158]], [[36, 26], [70, 46]], [[36, 66], [70, 86]]],
  raidho:  [[[34, 12], [34, 158]], [[34, 16], [68, 26], [68, 58], [34, 70]], [[44, 70], [68, 102], [68, 158]]],
  kenaz:   [[[72, 42], [30, 86], [74, 130]]],
  gebo:    [[[30, 52], [70, 120]], [[70, 52], [30, 120]]],
  wunjo:   [[[34, 12], [34, 158]], [[34, 18], [68, 28], [68, 62], [34, 74]]],
  hagalaz: [[[36, 12], [36, 158]], [[64, 12], [64, 158]], [[36, 92], [64, 80]]],
  naudiz:  [[[50, 12], [50, 158]], [[50, 62], [76, 94]]],
  isa:     [[[50, 12], [50, 158]]],
  jera:    [[[46, 48], [76, 84], [46, 120]], [[40, 86], [24, 108]]],
  eihwaz:  [[[60, 12], [60, 158]], [[60, 34], [36, 54], [60, 76]], [[60, 118], [84, 140], [60, 160]]],
  perthro: [[[34, 12], [34, 158]], [[34, 52], [74, 62], [74, 112], [34, 122]]],
  algiz:   [[[50, 160], [50, 62]], [[50, 62], [31, 34]], [[50, 62], [69, 34]]],
  sowilo:  [[[64, 14], [35, 50], [64, 86], [35, 122], [64, 156]]],
  tiwaz:   [[[50, 152], [50, 26]], [[29, 44], [50, 18], [71, 44]]],
  berkana: [[[34, 10], [34, 160]], [[34, 26], [68, 36], [68, 70], [34, 80]], [[34, 92], [68, 102], [68, 136], [34, 146]]],
  ehwaz:   [[[34, 22], [34, 148]], [[64, 22], [64, 148]], [[34, 62], [50, 92], [64, 62]]],
  mannaz:  [[[32, 30], [32, 150]], [[68, 30], [68, 150]], [[32, 74], [50, 44], [68, 74]], [[32, 126], [50, 96], [68, 126]]],
  laguz:   [[[36, 12], [36, 158]], [[36, 26], [66, 62]]],
  ingwaz:  [[[50, 16], [84, 86], [50, 156], [16, 86], [50, 16]]],
  dagaz:   [[[26, 22], [74, 148]], [[74, 22], [26, 148]]],
  othala:  [[[26, 58], [74, 122]], [[74, 58], [26, 122]], [[36, 48], [50, 26], [64, 48]]],
};

export type RuneName = keyof typeof RUNES;
export const RUNE_NAMES = Object.keys(RUNES) as RuneName[];

export interface RuneProps {
  name: RuneName;
  size?: number;
  variant?: "outline" | "fill" | "glow";
  className?: string;
  style?: CSSProperties;
  title?: string;
}

export function Rune({ name, size = 20, variant = "outline", className, style, title }: RuneProps) {
  const lines = RUNES[name];
  if (!lines) return null;
  const stroke = variant === "fill" ? 15 : 10;
  const cls = ["bf-rune", variant === "glow" ? "bf-rune--glow" : "", className ?? ""].filter(Boolean).join(" ");
  const polylines: ReactNode[] = lines.map((pts, i) =>
    h("polyline", {
      key: i,
      points: pts.map(([x, y]) => `${x},${y}`).join(" "),
      stroke: "currentColor",
      strokeWidth: stroke,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
  );
  return h(
    "svg",
    {
      className: cls,
      style,
      width: size,
      height: Math.round((size * 170) / 100),
      viewBox: "0 0 100 170",
      fill: "none",
      "aria-hidden": title ? undefined : true,
      role: title ? "img" : undefined,
    },
    h("title", { key: "t" }, title),
    ...polylines,
  );
}

/** CSS de las runas: cambio de material según variante/tema */
export const runeCss = `
.bf-rune--glow { filter: drop-shadow(0 0 6px currentColor); }
`;
