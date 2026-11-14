import { updateStyle } from '../shared';
import { PLAYER_BAR } from './player';

const STYLE_ID = "glowify-transparent-player-style";

function updateTransparentPlayerCss(transparent: boolean) {
  const css = transparent
    ? `${PLAYER_BAR} { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }`
    : "";
  updateStyle(STYLE_ID, css);
}

export function applyTransparentPlayer(mode: string) {
  const m = mode === "on" ? "on" : "off";
  localStorage.setItem("glowify-transparent-player", m);
  updateTransparentPlayerCss(m === "on");
}

export function applySavedTransparentPlayer() {
  const saved = localStorage.getItem("glowify-transparent-player") || "off";
  updateTransparentPlayerCss(saved === "on");
}
