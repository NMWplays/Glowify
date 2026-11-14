import { readNum, updateStyle } from '../shared';
import { Rgb, harmonize, parseColor, readableTextOn, toCss } from './color';
import { paletteColor, sampleImageColor } from './accentColor';
import { patch, patchDescriptor } from '../../lifecycle/runtime';
import { applyDefaultGlowAccent } from './glow';

const STORAGE = {
  mode: 'glowify-accent-mode',
  custom: 'glowify-custom-color',
  source: 'glowify-accent-source',
  saturation: 'glowify-accent-sat-boost',
  lightness: 'glowify-accent-light-boost',
};

const DEFAULTS = {
  mode: 'dynamic',
  custom: '#1DB954',
  source: 'background',
  saturation: 17,
  lightness: 11,
};

const SPOTIFY_GREEN: Rgb = [30, 215, 96];
const CACHE_LIMIT = 48;
const STYLE_ID = 'glowify-accent-style';
const READY_EVENT = 'glowifyAccentColorReady';
const SPOTIFY_CANVAS_GREEN = /^rgba?\(11%, 73%, 33%(?:, ([\d.]+%?))?\)$/;
const SPOTIFY_CANVASES = '.equalizer-canvas';
const BUSY_ANIMATIONS = '.glowify-player-icon.is-skipping';
const BUSY_RETRY_MS = 120;
const ACCENT_CSS = `
  .encore-dark-theme,
  .encore-base-set,
  .encore-inverted-set,
  .encore-inverted-dark-set,
  .encore-muted-accent-set,
  .encore-app-frame-set {
    --text-bright-accent: var(--glowify-accent) !important;
    --essential-bright-accent: var(--glowify-accent) !important;
    --text-positive: var(--glowify-accent) !important;
    --essential-positive: var(--glowify-accent) !important;
  }

  .encore-bright-accent-set,
  .encore-positive-set,
  .e-button-primary__inner,
  .e-legacy-chip__inner--selected,
  .lyrics-sync-button-container [class*="-set"],
  .library-create-menu-badge {
    --background-base: var(--glowify-accent) !important;
    --background-highlight: var(--glowify-accent) !important;
    --background-press: var(--glowify-accent) !important;
    --background-elevated-base: var(--glowify-accent) !important;
    --background-elevated-highlight: var(--glowify-accent) !important;
    --background-elevated-press: var(--glowify-accent) !important;
    --background-tinted-base: var(--glowify-accent) !important;
    --background-tinted-highlight: var(--glowify-accent) !important;
    --background-tinted-press: var(--glowify-accent) !important;
    --decorative-subdued: var(--glowify-accent) !important;
    --text-base: var(--glowify-on-accent) !important;
  }

  .progress-bar-root {
    --is-active-fg-color: var(--glowify-accent) !important;
  }

  .context-menu-item-button[role="menuitemradio"][aria-checked="true"],
  .library-filter-preview-create-icon,
  .queue-preview-row-title--playing,
  .video-overlay-button--active,
  .subtitles-button--on:hover,
  .lyrics-button.lyrics-button--active,
  .download-button--downloaded,
  .episode-progress-done-icon,
  .miniplayer-button--active button > svg,
  .error-page-logo,
  .nav-link.nav-link.nav-link:hover,
  .nav-link.nav-link.nav-link:focus,
  .bottom-link.bottom-link.bottom-link:hover,
  .footer--full .bottom-link--small.bottom-link--small.bottom-link--small:hover,
  .footer--full .bottom-button.bottom-button.bottom-button:hover,
  .footer--full .bottom-button.bottom-button.bottom-button span:hover,
  .settings-zoom-preview-image[data-selected="true"],
  .audiobook-chapter-row .audiobook-chapter-title--active,
  .episode-card.more-like-this-episode--playing .episode-card-title,
  .show-trailer.show-trailer--active .show-trailer-title,
  .pip-settings-button.pip-settings-button--active,
  .podcast-charts-market-selector-option-check,
  .podcast-charts-market-selector-option-label--selected,
  .your-episodes-cover-icon,
  .your-episodes-fallback-icon {
    color: var(--glowify-accent) !important;
  }

  .queue-preview-tab--active,
  .queue-preview-row--highlighted {
    border-bottom-color: var(--glowify-accent) !important;
  }

  .video-overlay-button--active {
    border-color: var(--glowify-accent) !important;
  }

  .tilt-artwork:focus-visible {
    outline-color: var(--glowify-accent) !important;
  }

  .download-progress-fill {
    stroke: var(--glowify-accent) !important;
  }

  .play-button-ring-svg [id*="-green"] stop {
    stop-color: var(--glowify-accent) !important;
  }

  .play-button-ring-svg circle[stroke^="#1ED7" i] {
    stroke: var(--glowify-accent) !important;
  }

  .library-create-menu-badge,
  .e-chip-clear,
  .labs-studio-start-button,
  .labs-studio-lets-go-button,
  .fatal-error-reload-button,
  .feedback-bar,
  .video-overlay-button--active::after,
  .lyrics-button.lyrics-button--active-dot::after,
  input:checked ~ .toggle-switch-track,
  .concert-interested-button--active,
  .concert-interested-button[aria-checked="true"],
  .concert-radius-slider .concert-radius-fill,
  .concerts-date-picker-preset:active {
    background-color: var(--glowify-accent) !important;
    color: var(--glowify-on-accent) !important;
  }

  .dj-button .dj-button-inner:hover {
    background: color-mix(in srgb, var(--glowify-accent) 8%, transparent) !important;
  }

  .dj-button .dj-button-inner:active {
    background: color-mix(in srgb, var(--glowify-accent) 12%, transparent) !important;
  }

  .device-picker-jam-card {
    background: radial-gradient(
      82.95% 283.44% at 50% -160.29%,
      color-mix(in srgb, var(--glowify-accent) 30%, transparent) 0%,
      var(--gradient-color-bottom) 100%
    ) !important;
  }

  img[src*="equaliser-animated-green"],
  img[src*="equaliser-green"] {
    object-position: -100vw 0;
    background-color: var(--glowify-accent);
    mask: url("images/equaliser-animated-green.gif") center / contain no-repeat;
  }

  img[src*="equaliser-green.svg"] {
    mask-image: url("images/equaliser-green.svg");
  }
`;

const sampledColors = new Map<string, Rgb>();
const writtenVariables = new Map<string, string>();
let images: { backdrop: string | null; cover: string | null } = { backdrop: null, cover: null };
let requestedImage: string | null = null;
let dynamicBase: Rgb | null = null;
let activeColor: Rgb = SPOTIFY_GREEN;
let deferredRender = 0;

export function startAccent(): void {
  updateStyle(STYLE_ID, ACCENT_CSS);
  recolorSpotifyCanvases();
  render();
}

export function syncAccent(backdrop: string | null, cover: string | null): void {
  images = { backdrop, cover };
  void resolveDynamicBase();
}

export function refreshAccent(): void {
  requestedImage = null;
  render();
  void resolveDynamicBase();
}

export function selectAccentMode(mode: string): void {
  localStorage.setItem(STORAGE.mode, mode);
  render();
}

export function selectCustomAccent(color: string): void {
  localStorage.setItem(STORAGE.custom, color);
  render();
}

export function selectAccentSource(source: string): void {
  localStorage.setItem(STORAGE.source, source);
  void resolveDynamicBase();
}

export function setAccentSaturation(value: number): void {
  localStorage.setItem(STORAGE.saturation, String(value));
  render();
}

export function setAccentLightness(value: number): void {
  localStorage.setItem(STORAGE.lightness, String(value));
  render();
}

export function resetAccent(): void {
  Object.values(STORAGE).forEach((key) => localStorage.removeItem(key));
  refreshAccent();
}

export function applyGlowAccent(color: string): void {
  document.documentElement.style.setProperty('--glowify-glow-accent', color);
  localStorage.setItem('glowify-glow-mode', 'custom');
  localStorage.setItem('glowify-glow-color', color);
}

export function resetGlowAccentToDefault(): void {
  localStorage.setItem('glowify-glow-mode', 'default');
  applyDefaultGlowAccent();
}

function render(): void {
  window.clearTimeout(deferredRender);
  // A :root restyle mid-skip stutters the icon animation.
  if (document.querySelector(BUSY_ANIMATIONS)) {
    deferredRender = window.setTimeout(render, BUSY_RETRY_MS);
    return;
  }

  const dynamic = dynamicBase ? harmonize(dynamicBase, saturationFactor(), lightnessFactor()) : SPOTIFY_GREEN;
  const accent = activeAccent(dynamic);
  activeColor = accent;

  const dynamicChanged = writeVariable('--accent-color', toCss(dynamic));
  if (writeVariable('--glowify-accent', toCss(accent))) redrawSpotifyCanvases();
  writeVariable('--glowify-on-accent', readableTextOn(accent));

  if (dynamicChanged) window.dispatchEvent(new Event(READY_EVENT));
}

function activeAccent(dynamic: Rgb): Rgb {
  const mode = localStorage.getItem(STORAGE.mode) || DEFAULTS.mode;
  if (mode === 'dynamic') return dynamic;
  if (mode === 'custom') return parseColor(localStorage.getItem(STORAGE.custom) || DEFAULTS.custom) ?? SPOTIFY_GREEN;
  return SPOTIFY_GREEN;
}

function saturationFactor(): number {
  return readNum(STORAGE.saturation, DEFAULTS.saturation) / DEFAULTS.saturation;
}

function lightnessFactor(): number {
  return readNum(STORAGE.lightness, DEFAULTS.lightness) / DEFAULTS.lightness;
}

async function resolveDynamicBase(): Promise<void> {
  const image = accentImage();
  if (!image || image === requestedImage) return;
  requestedImage = image;

  const color = await colorOf(image);
  if (image !== requestedImage) return;

  dynamicBase = color;
  render();
}

function accentImage(): string | null {
  const source = localStorage.getItem(STORAGE.source) || DEFAULTS.source;
  return source === 'cover' ? images.cover : images.backdrop ?? images.cover;
}

async function colorOf(image: string): Promise<Rgb> {
  const cached = sampledColors.get(image);
  if (cached) return cached;

  const sampled = await sampleImageColor(image);
  if (sampled) {
    remember(image, sampled);
    return sampled;
  }

  const cover = images.cover && images.cover !== image ? await sampleImageColor(images.cover) : null;
  return cover ?? (await paletteColor(SpotiKit.Player?.track?.uri)) ?? SPOTIFY_GREEN;
}

function remember(image: string, color: Rgb): void {
  if (sampledColors.size >= CACHE_LIMIT) sampledColors.delete(sampledColors.keys().next().value!);
  sampledColors.set(image, color);
}

function recolorSpotifyCanvases(): void {
  const strokeStyle = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'strokeStyle');
  if (!strokeStyle?.set) return;
  patchDescriptor(CanvasRenderingContext2D.prototype, 'strokeStyle', {
    ...strokeStyle,
    set(value: string | CanvasGradient | CanvasPattern) {
      strokeStyle.set!.call(this, typeof value === 'string' ? canvasAccent(value) : value);
    },
  });

  const addColorStop = CanvasGradient.prototype.addColorStop;
  patch(CanvasGradient.prototype, 'addColorStop', function (this: CanvasGradient, offset: number, color: string) {
    addColorStop.call(this, offset, canvasAccent(color));
  });
}

function redrawSpotifyCanvases(): void {
  document.querySelectorAll<HTMLCanvasElement>(SPOTIFY_CANVASES).forEach((canvas) => {
    canvas.style.width = 'calc(100% - 1px)';
    requestAnimationFrame(() => requestAnimationFrame(() => canvas.style.removeProperty('width')));
  });
}

function canvasAccent(color: string): string {
  const match = SPOTIFY_CANVAS_GREEN.exec(color);
  if (!match) return color;
  const [r, g, b] = activeColor.map(Math.round);
  return `rgba(${r}, ${g}, ${b}, ${match[1] ?? 1})`;
}

function writeVariable(name: string, value: string): boolean {
  if (writtenVariables.get(name) === value) return false;
  writtenVariables.set(name, value);
  document.documentElement.style.setProperty(name, value);
  return true;
}