export const POPUP_BOUNCE_KEY = "glowify-popup-bounce";
const BOUNCE_CLASS = "glowify-popup-bounce";

export function isPopupBounceOn(): boolean {
  return (localStorage.getItem(POPUP_BOUNCE_KEY) || "on") === "on";
}

function syncClass() {
  document.documentElement.classList.toggle(BOUNCE_CLASS, isPopupBounceOn());
}

export function applyPopupBounce(mode: string) {
  localStorage.setItem(POPUP_BOUNCE_KEY, mode);
  syncClass();
  window.dispatchEvent(new Event("glowifyPopupBounceChange"));
}

export function ensurePopupBounceApplied() {
  syncClass();
  window.dispatchEvent(new Event("glowifyPopupBounceChange"));
}
