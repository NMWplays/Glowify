import { updateStyle } from '../shared';

const STYLE_ID = "glowify-connect-bar-style";
export const CONNECT_BAR_KEY = "glowify-connect-bar";

function updateConnectBarCss(show: boolean) {
  updateStyle(STYLE_ID, show ? "" : ".connect-bar { display: none !important; }");
}

export function applyConnectBar(mode: string) {
  const m = mode === "show" ? "show" : "hide";
  localStorage.setItem(CONNECT_BAR_KEY, m);
  updateConnectBarCss(m === "show");
}

export function applySavedConnectBar() {
  updateConnectBarCss((localStorage.getItem(CONNECT_BAR_KEY) || "show") === "show");
}
