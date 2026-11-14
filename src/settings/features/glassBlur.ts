import { readNum, updateStyle } from '../shared';

export const BACKDROP_BLUR_KEY = "glowify-backdrop-blur";
export const BACKDROP_BLUR_DEFAULT = 32;

function applyCss() {
  const backdrop = readNum(BACKDROP_BLUR_KEY, BACKDROP_BLUR_DEFAULT);
  updateStyle(
    "glowify-backdrop-blur",
    `:root { --glowify-backdrop-blur: ${backdrop}px !important; }`
  );
}

export function setBackdropBlur(px: number) {
  localStorage.setItem(BACKDROP_BLUR_KEY, String(px));
  applyCss();
}

export function ensureBackdropBlurApplied() {
  applyCss();
}
