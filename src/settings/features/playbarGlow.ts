import { readLS, updateStyle } from '../shared';
import { Playback, SongData, watchPlayback, watchSong } from './audioPulse';

export const PLAYBAR_GLOW_KEY = 'glowify-playbar-glow-react';
const STYLE_ID = 'glowify-playbar-glow-style';
const GLOW_CLASS = 'glowify-playbar-glow';
const PLAYBAR = '.now-playing-bar-area';
const ATTACK = 0.04;
const RELEASE = 0.22;
const MAX_DRIFT_MS = 120;
const FADE_MS = 400;

const CSS = `
.${GLOW_CLASS} {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  box-shadow: 0 0 calc(var(--glowify-glow-blur, 25px) * 2.2) calc(var(--glowify-glow-spread, 8px) * 3) var(--glowify-glow-accent, var(--accent-color));
  pointer-events: none;
  opacity: 0;
  will-change: opacity;
}
html.glowify-glow-disabled .${GLOW_CLASS} {
  display: none;
}`;

let glow: HTMLElement | null = null;
let stopSong: (() => void) | null = null;
let stopPlay: (() => void) | null = null;
let timer = 0;
let template: KeyframeEffect | null = null;
let templateUri = '';
let live: Animation | null = null;
let fade: Animation | null = null;
let last: Playback | null = null;

function isEnabled(): boolean {
  return readLS(PLAYBAR_GLOW_KEY, 'off') === 'on';
}

function buildTemplate(song: SongData): void {
  const bass = song.bands[0];
  const low = song.bands[1];
  const up = 1 - Math.exp(-song.step / ATTACK);
  const down = 1 - Math.exp(-song.step / RELEASE);
  const frames: Keyframe[] = [];
  let level = 0;
  let offset = 0;
  for (let i = 0; i < bass.length; i++) {
    const goal = Math.min(1, bass[i] * 0.95 + low[i] * 0.45);
    level += (goal - level) * (goal > level ? up : down);
    offset = Math.max(offset, Math.min(1, (i * song.step) / song.duration));
    frames.push({ opacity: level.toFixed(3), offset });
  }
  template = new KeyframeEffect(null, frames, { duration: song.duration * 1000, fill: 'both' });
  templateUri = song.uri;
}

function fadeOut(): void {
  if (!glow) return;
  const from = live ? getComputedStyle(glow).opacity : null;
  live?.cancel();
  live = null;
  if (from === null || fade) return;
  fade = glow.animate([{ opacity: from }, { opacity: 0 }], { duration: FADE_MS, easing: 'ease-out', fill: 'forwards' });
  fade.onfinish = () => {
    fade?.cancel();
    fade = null;
  };
}

function sync(play: Playback): void {
  last = play;
  if (!glow?.isConnected || !template || play.uri !== templateUri || !play.playing) {
    fadeOut();
    return;
  }
  const pos = play.pos + Date.now() - play.at;
  if (!live) {
    fade?.cancel();
    fade = null;
    const effect = new KeyframeEffect(template);
    effect.target = glow;
    live = new Animation(effect, document.timeline);
    live.currentTime = pos;
    live.play();
    return;
  }
  if (Math.abs(Number(live.currentTime ?? 0) - pos) > MAX_DRIFT_MS) live.currentTime = pos;
  if (live.playState !== 'running') live.play();
}

function mount(): void {
  const bar = document.querySelector<HTMLElement>(PLAYBAR);
  if (!bar || (glow?.isConnected && glow.parentElement === bar)) return;
  live?.cancel();
  live = null;
  fade?.cancel();
  fade = null;
  glow?.remove();
  glow = document.createElement('div');
  glow.className = GLOW_CLASS;
  bar.prepend(glow);
  if (last) sync(last);
}

function start(): void {
  updateStyle(STYLE_ID, CSS);
  mount();
  if (!stopSong) stopSong = watchSong((song) => {
    live?.cancel();
    live = null;
    template = null;
    templateUri = '';
    if (song) buildTemplate(song);
    if (last) sync(last);
  });
  if (!stopPlay) stopPlay = watchPlayback(sync);
  if (!timer) timer = window.setInterval(mount, 2000);
}

function stop(): void {
  stopSong?.();
  stopSong = null;
  stopPlay?.();
  stopPlay = null;
  if (timer) clearInterval(timer);
  timer = 0;
  live?.cancel();
  live = null;
  fade?.cancel();
  fade = null;
  glow?.remove();
  glow = null;
  template = null;
  templateUri = '';
  updateStyle(STYLE_ID, '');
}

export function installPlaybarGlow(): void {
  if (isEnabled()) start();
  else stop();
}

export function setPlaybarGlow(mode: string): void {
  localStorage.setItem(PLAYBAR_GLOW_KEY, mode === 'on' ? 'on' : 'off');
  installPlaybarGlow();
}
