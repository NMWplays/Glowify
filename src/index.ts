import { startBackground } from './background';
import { startPopupBounce } from './popupBounce';
import { startGlowifySettings } from './settings';

function boot(): void {
  startBackground();
  startPopupBounce();
  void startGlowifySettings();
}

export default function start(): void {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
}
