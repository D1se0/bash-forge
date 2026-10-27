# Design system nórdico — «La forja bajo la aurora» (borrador v2)

Bash Forge es una herrería enana (Nidavellir) bajo una aurora boreal. El alumno forja
scripts golpe a golpe: calma escandinava por defecto, magia solo en los premios.

## Tokens (fuente única: `packages/ui/src/tokens.css`)

### Tema oscuro «Noche de Fiordo» (por defecto)
| Token | Valor |
|---|---|
| `--bg-abyss` | `#1E222A` |
| `--bg-base` | `#2E3440` |
| `--bg-surface` | `#3B4252` |
| `--bg-raised` | `#434C5E` |
| `--border` | `#4C566A` |
| `--fg-strong/--fg/--fg-muted/--fg-faint` | `#ECEFF4 / #E5E9F0 / #D8DEE9 / #9AA5B8` |
| `--ice-1..4` | `#8FBCBB #88C0D0 #81A1C1 #5E81AC` |
| `--ember / --ember-glow` | `#D08770 / #EBCB8B` |
| `--aurora-g/v/r/y` | `#A3BE8C #B48EAD #BF616A #EBCB8B` |
| `--aurora-gradient` | `120deg, #8FBCBB → #81A1C1 35% → #B48EAD 70% → #A3BE8C` (solo decoración) |

### Tema claro «Día de Nieve»
Fondos `#ECEFF4 / #E5E9F0 / #D8DEE9`, texto `#2E3440`; acentos oscurecidos a los valores
que el script `scripts/contrast-check.ts` valide ≥ 4.5:1 (3:1 texto grande).

**Regla dura:** ningún color literal en componentes; solo tokens. El check de contraste
fase el build.

## Tipografía (autoalojada, woff2 latin+latin-ext, `font-display: swap`)

- UI: **Inter Tight** · Titulares/épico: **Fraunces** (peso medio) · Código/terminal: **JetBrains Mono** (ligaduras).
- Escala modular 1.25; línea 1.6 prosa / 1.4 UI; máx. 70 ch por línea en lecciones.

## Forma, superficie y aire

- Rejilla 8 px; radios 10/16/24; bordes 1 px de baja opacidad; sombras azuladas suaves.
- Cristal escarchado (`backdrop-filter`) con fallback sólido; textura de ruido SVG al 2–3 %.
- Espacio negativo generoso: los paneles respiran.

## Iconografía rúnica

- Futhark antiguo: 24 runas, una por categoría de lección, insignia y acción clave.
- `<Rune name="kenaz" variant="outline|fill|glow" />` — SVG propio, nitidez 1.5px stroke coherente.
- **Logo:** yunque estilizado que integra ᚲ (antorcha). Variantes claro/oscuro/mono + favicon + OG.
- Cenefas de nudos generadas en SVG como separadores de sección.

## Movimiento

- Curva `cubic-bezier(0.22, 1, 0.36, 1)`; duraciones 150/250/400/700 ms; hierro pesado y elegante.
- Momentos mágicos: golpe de martillo + chispas al superar un ejercicio; aurora intensificada al subir de mundo; niebla para los jefes.
- Todo alternativo con `prefers-reduced-motion` (fundidos simples, sin parallax/partículas).

## Voz (ES/EN redactados, no traducidos)

- «El hierro aún está frío. Prueba de nuevo.» · «Buen golpe. Tu script ya tiene forma.» · «Mundo desbloqueado: Alfheim».
- Estados vacíos/errores con ilustración y mensaje propio; nunca «Error» a secas.

## Temas de terminal (11)

Nord (defecto), Nord Aurora, Brasa, Ventisca, Dracula, Tokyo Night, Catppuccin Frappé/Latte,
Solarized dark/light, Gruvbox, Matrix, Amber CRT. Selector en vivo con previsualización y
validación de contraste por par texto/fondo.

## Guía viva

- `docs/DESIGN.md` (este doc) + ruta `/styleguide` en la app: tokens, componentes, estados, runas, temas.
- La línea base de la regresión visual son las capturas de `/styleguide`.
