/**
 * /styleguide — guía viva del sistema de diseño (tokens, tipografía, runas, logo).
 * Se activa con el hash #/styleguide en la misma SPA (sin router extra).
 * Es la base de las capturas de regresión visual de las fases siguientes.
 */
import { Rune, RUNE_NAMES, Logo } from "@bashforge/ui";

const COLORS: [string, string][] = [
  ["--bg-abyss", "abyss"], ["--bg-base", "base"], ["--bg-surface", "surface"],
  ["--bg-raised", "raised"], ["--border", "borde"],
  ["--fg-strong", "texto fuerte"], ["--fg", "texto"], ["--fg-muted", "texto apagado"], ["--fg-faint", "texto tenue"],
  ["--ice-2", "hielo acción"], ["--ice-3", "hielo 3"], ["--ice-4", "hielo 4"],
  ["--ember", "brasa"], ["--ember-glow", "brasita"],
  ["--aurora-g", "éxito"], ["--aurora-v", "XP"], ["--aurora-r", "error"], ["--aurora-y", "aviso"],
];

function Swatches() {
  return (
    <section>
      <h2>Paleta — {COLORS.length} tokens</h2>
      {COLORS.map(([token, label]) => (
        <div className="sg-swatch" key={token}>
          <span className="sg-chip" style={{ background: `var(${token})` }} />
          <b>{label}</b>
          <code>{token}</code>
        </div>
      ))}
    </section>
  );
}

function Typography() {
  return (
    <section>
      <h2>Tipografía</h2>
      <p className="sg-type-3">Fraunces — titulares épicos</p>
      <p className="sg-type-2">Inter Tight — interfaz de la forja</p>
      <p className="sg-type-1">
        La forja respira calma escandinava: espacio negativo generoso, materiales honestos y
        <em> un solo acento cálido</em>. El resto del tiempo, la interfaz es silenciosa y clara.
      </p>
      <p className="sg-mono">JetBrains Mono — `$ echo forjado` ᚲ</p>
    </section>
  );
}

function Components() {
  return (
    <section>
      <h2>Componentes y estados</h2>
      <div className="sg-btn">
        <button className="is-primary">hielo · primario</button>
        <button className="is-ember">ᚲ Comprobar</button>
        <button>Secundario</button>
        <button disabled>Deshabilitado</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <div className="sg-aurora" />
      </div>
    </section>
  );
}

function Runes() {
  const special = new Set(["kenaz", "sowilo", "dagaz", "othala"]);
  return (
    <section>
      <h2>Futhark antiguo — {RUNE_NAMES.length} runas</h2>
      <div className="sg-runes">
        {RUNE_NAMES.map((name) => (
          <div
            key={name}
            className={`sg-rune-card${special.has(name) ? (name === "kenaz" ? " is-ember" : " is-aurora") : ""}`}
          >
            <Rune name={name} size={26} variant={name === "kenaz" ? "glow" : "outline"} />
            <small>{name}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function Logos() {
  return (
    <section>
      <h2>Logo — yunque + kenaz ᚲ</h2>
      <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
        <Logo size={44} />
        <Logo size={30} variant="mono" />
        <Logo size={74} showWordmark={false} />
      </div>
    </section>
  );
}

export function Styleguide() {
  return (
    <div className="sg">
      <div className="sg-hero">
        <Logo size={40} />
        <h1 className="sg-title">Guía viva del sistema de diseño</h1>
        <p className="sg-sub">
          «La forja bajo la aurora» — tokens únicos, runas del Futhark, tipografía autoalojada.
          contraste AA validado por <code>scripts/contrast-check.mjs</code>.
        </p>
      </div>
      <div className="sg-knot" />
      <Swatches />
      <Typography />
      <Components />
      <Runes />
      <Logos />
      <footer style={{ margin: "0 24px", color: "var(--fg-faint)", fontSize: 12 }}>
        Regresión visual: capturar esta página por viewport/tema/idioma (matriz 4.3).
      </footer>
    </div>
  );
}
