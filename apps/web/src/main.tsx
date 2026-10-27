import { createRoot } from "react-dom/client";
import "@bashforge/ui/tokens.css";
// fonts.css se enlaza desde index.html (<link>) — evita resolver /fonts dentro del bundle
import "@bashforge/ui/styleguide.css";
import "./styles.css";
import { App } from "./App";
import { Styleguide } from "./Styleguide";

const root = document.getElementById("root");
if (root) {
  const isStyleguide = window.location.hash.startsWith("#/styleguide");
  createRoot(root).render(
    <div data-theme={document.documentElement.dataset.theme ?? "dark"}>
      {isStyleguide ? <Styleguide /> : <App />}
    </div>,
  );
}
