import { HEADER_IMAGE, ensureStyleTag, readNum } from '../shared';

const KEYFRAMES = 'glowify-artist-scroll';

export function applyArtistScrollEffect(blur: number, brightness: number) {
  localStorage.setItem("glowify-artist-scroll-blur", String(blur));
  localStorage.setItem("glowify-artist-scroll-brightness", String(brightness));
  const style = ensureStyleTag("glowify-artist-scroll-effect");
  const brightnessVal = (brightness / 100).toFixed(2);
  style.textContent = `
${HEADER_IMAGE} {
  animation-name: ${KEYFRAMES};
}
@keyframes ${KEYFRAMES} {
  0% {
    transform: none;
    filter: blur(0px) brightness(${brightnessVal});
  }
  40%, 100% {
    transform: scale(1.5);
    filter: blur(${blur}px) brightness(${brightnessVal});
  }
}`;
}

export function ensureArtistScrollEffectApplied() {
  const blur = readNum("glowify-artist-scroll-blur", 15);
  const brightness = readNum("glowify-artist-scroll-brightness", 70);
  applyArtistScrollEffect(blur, brightness);
}
