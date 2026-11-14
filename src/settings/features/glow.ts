import { readNum, updateStyle } from '../shared';

export const GLOW_EFFECT_MODE_KEY = "glowify-glow-effect-mode";
export const GLOW_BLUR_KEY = "glowify-glow-blur";
export const GLOW_SPREAD_KEY = "glowify-glow-spread";
export const GLOW_SAT_BOOST_KEY = "glowify-glow-saturation-boost";
export const GLOW_LIGHT_BOOST_KEY = "glowify-glow-lightness-boost";
export const OUTLINE_MODE_KEY = "glowify-outline-mode";
export const OUTLINE_COLOR_KEY = "glowify-outline-color";

export const GLOW_DEFAULTS = {
  effectMode: "on",
  blur: 25,
  spread: 8,
  satBoost: 17,
  lightBoost: 11,
  outlineColor: "#1DB954",
};

function parseRgbLike(color: string): [number, number, number] | null {
  const hex = color.trim().match(/^#?([0-9a-f]{6})$/i)?.[1];
  if (hex) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  const parts = color.match(/\d+(?:\.\d+)?/g);
  if (!parts || parts.length < 3) return null;
  return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
}

function boostColor(color: string, satBoost = 1.7, lightBoost = 1.1): string {
  const rgb = parseRgbLike(color);
  if (!rgb) return color;
  const [r, g, b] = rgb.map((v) => Math.max(0, Math.min(255, v)) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }

  s = Math.min(s * satBoost, 1);
  l = Math.min(l * lightBoost, 1);

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r2: number;
  let g2: number;
  let b2: number;
  if (s === 0) {
    r2 = g2 = b2 = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r2 = hue2rgb(p, q, h + 1 / 3);
    g2 = hue2rgb(p, q, h);
    b2 = hue2rgb(p, q, h - 1 / 3);
  }

  return `rgb(${Math.round(r2 * 255)},${Math.round(g2 * 255)},${Math.round(b2 * 255)})`;
}

export function applyGlowEffectMode(enabled: boolean) {
  localStorage.setItem(GLOW_EFFECT_MODE_KEY, enabled ? "on" : "off");
  document.documentElement.classList.toggle("glowify-glow-disabled", !enabled);
  const outline = "solid 1px var(--glowify-outline-accent, var(--accent-color))";
  updateStyle(
    "glowify-glow-effect-mode",
    enabled
      ? `:root { --glowify-outline: none !important; }`
      : `:root { --glowify-shadow: none !important; --glowify-outline: ${outline} !important; }
         .glowifySectionTitle,
         .glowifySectionBody,
         .glowifyControlSurface,
         .glowifySettingsPanel,
         .glowifySelectMenu,
         .glowifySectionNavScrollBtn {
           outline: var(--glowify-outline) !important;
         }`
  );
}

export function ensureGlowEffectModeApplied() {
  applyGlowEffectMode((localStorage.getItem(GLOW_EFFECT_MODE_KEY) || GLOW_DEFAULTS.effectMode) !== "off");
}

export function applyGlowSize(blur: number, spread: number) {
  document.documentElement.style.setProperty("--glowify-glow-blur", `${blur}px`);
  document.documentElement.style.setProperty("--glowify-glow-spread", `${spread}px`);
  document.documentElement.style.setProperty("--glowify-glow-room", `${blur + spread}px`);
  localStorage.setItem(GLOW_BLUR_KEY, String(blur));
  localStorage.setItem(GLOW_SPREAD_KEY, String(spread));
}

export function ensureGlowSizeApplied() {
  const blur = readNum(GLOW_BLUR_KEY, GLOW_DEFAULTS.blur);
  const spread = readNum(GLOW_SPREAD_KEY, GLOW_DEFAULTS.spread);
  applyGlowSize(blur, spread);
}

export function setGlowBoosts(sat: number, light: number) {
  localStorage.setItem(GLOW_SAT_BOOST_KEY, String(sat));
  localStorage.setItem(GLOW_LIGHT_BOOST_KEY, String(light));
  applyDefaultGlowAccent();
}

const FADE_CLASS = "glowify-glow-fading";
const KEEP_ATTR = "data-glowify-glow-keep";
const FADE_MS = 600;
const FADE_EXEMPT =
  ".glowify-bg-layer, .glowify-animated-bg, .glowify-animated-tile, .glowify-kawarp-bg, #cs-track, #cs-track *, #glowify-next-song-card, #glowify-next-song-card *";

let fadeTimer = 0;
let fadeIdle = 0;
let kept: Element[] = [];

function fadeCss(): string {
  const el = `*:not([${KEEP_ATTR}], ${FADE_EXEMPT})`;
  const scope = `html.${FADE_CLASS}`;
  return `${scope} ${el}, ${scope} ${el}::before, ${scope} ${el}::after { transition: box-shadow ${FADE_MS}ms ease, outline-color ${FADE_MS}ms ease !important; }`;
}

function endFade(): void {
  fadeIdle = 0;
  document.documentElement.classList.remove(FADE_CLASS);
  for (const el of kept) el.removeAttribute(KEEP_ATTR);
  kept = [];
}

function beginFade(): void {
  const root = document.documentElement;
  clearTimeout(fadeTimer);
  if (fadeIdle) {
    cancelIdleCallback(fadeIdle);
    fadeIdle = 0;
  }
  if (!root.classList.contains(FADE_CLASS)) {
    updateStyle("glowify-glow-fade-style", fadeCss());
    for (const anim of document.getAnimations()) {
      if (!(anim instanceof CSSTransition) || anim.playState !== "running") continue;
      const target = anim.effect instanceof KeyframeEffect ? anim.effect.target : null;
      if (target && !target.hasAttribute(KEEP_ATTR)) {
        target.setAttribute(KEEP_ATTR, "");
        kept.push(target);
      }
    }
    root.classList.add(FADE_CLASS);
  }
  fadeTimer = window.setTimeout(() => {
    fadeIdle = requestIdleCallback(endFade, { timeout: 1500 });
  }, FADE_MS + 100);
}

function setGlowAccent(color: string, fade: boolean): void {
  const root = document.documentElement;
  const current = root.style.getPropertyValue("--glowify-glow-accent").trim();
  if (current === color) return;
  if (fade && current && document.visibilityState === "visible" && !root.classList.contains("glowify-glow-disabled")) {
    beginFade();
  }
  root.style.setProperty("--glowify-glow-accent", color);
}

export function applyDefaultGlowAccent(fade = false) {
  if ((localStorage.getItem("glowify-glow-mode") || "default") !== "default") return;
  const root = document.documentElement;
  const raw =
    root.style.getPropertyValue("--accent-color").trim() ||
    getComputedStyle(root).getPropertyValue("--accent-color").trim() ||
    "#1DB954";
  const sat = readNum(GLOW_SAT_BOOST_KEY, GLOW_DEFAULTS.satBoost) / 10;
  const light = readNum(GLOW_LIGHT_BOOST_KEY, GLOW_DEFAULTS.lightBoost) / 10;
  setGlowAccent(boostColor(raw, sat, light), fade === true);
}

export function applyOutlineAccent(color: string) {
  document.documentElement.style.setProperty("--glowify-outline-accent", color);
  localStorage.setItem(OUTLINE_MODE_KEY, "custom");
  localStorage.setItem(OUTLINE_COLOR_KEY, color);
}

export function resetOutlineAccentToDefault() {
  document.documentElement.style.setProperty("--glowify-outline-accent", "var(--accent-color)");
  localStorage.setItem(OUTLINE_MODE_KEY, "default");
}

export function ensureOutlineAccentApplied() {
  const mode = localStorage.getItem(OUTLINE_MODE_KEY) || "default";
  if (mode === "custom") applyOutlineAccent(localStorage.getItem(OUTLINE_COLOR_KEY) || GLOW_DEFAULTS.outlineColor);
  else resetOutlineAccentToDefault();
}

export function ensureGlowApplied() {
  ensureGlowSizeApplied();
  ensureGlowEffectModeApplied();
  ensureOutlineAccentApplied();
  applyDefaultGlowAccent();
}
