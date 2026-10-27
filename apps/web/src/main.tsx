import { createRoot } from "react-dom/client";
import "@bashforge/ui/tokens.css";
// fonts.css se enlaza desde index.html (<link>) — evita resolver /fonts dentro del bundle
import "@bashforge/ui/styleguide.css";
import "./styles.css";
import { initTheme } from "./theme";
import { App } from "./App";
import { Styleguide } from "./Styleguide";

// aplica el tema ANTES del primer render: sin FOUC y con prefers-color-scheme
initTheme();

const root = document.getElementById("root");
if (root) {
  const isStyleguide = window.location.hash.startsWith("#/styleguide");
  createRoot(root).render(isStyleguide ? <Styleguide /> : <App />);
}
