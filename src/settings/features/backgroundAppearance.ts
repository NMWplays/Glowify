import { readNum } from '../shared';

export const BG_ENGINE_KEY = 'glowify-bg-engine';
export type BgEngine = 'kawarp' | 'tiles';

export function getBgEngine(): BgEngine {
  return localStorage.getItem(BG_ENGINE_KEY) === 'tiles' ? 'tiles' : 'kawarp';
}

export function setBgEngine(engine: BgEngine): void {
  localStorage.setItem(BG_ENGINE_KEY, engine);
  applyBackgroundAppearance();
  window.dispatchEvent(new Event('glowifyBackgroundChange'));
}

export const HIRES_COVER_KEY = 'glowify-hires-cover';

export function isHiResCoverOn(): boolean {
  return (localStorage.getItem(HIRES_COVER_KEY) || 'on') === 'on';
}

export function setHiResCover(on: boolean): void {
  localStorage.setItem(HIRES_COVER_KEY, on ? 'on' : 'off');
  window.dispatchEvent(new Event('glowifyBackgroundChange'));
}

export const BG_SURFACES = {
  static: {
    blurKey: 'glowify-bg-blur',
    brightnessKey: 'glowify-bg-brightness',
    blurVar: '--glowify-bg-blur',
    brightnessVar: '--glowify-bg-brightness',
    defaults: { blur: 7, brightness: 45 },
  },
  kawarp: {
    blurKey: 'glowify-kawarp-blur',
    brightnessKey: 'glowify-kawarp-brightness',
    blurVar: '',
    brightnessVar: '--glowify-kawarp-brightness',
    defaults: { blur: 10, brightness: 45 },
  },
  tiles: {
    blurKey: 'glowify-tiles-blur',
    brightnessKey: 'glowify-tiles-brightness',
    blurVar: '--glowify-tiles-blur',
    brightnessVar: '--glowify-tiles-brightness',
    defaults: { blur: 50, brightness: 60 },
  },
} as const;

export type BgSurface = keyof typeof BG_SURFACES;
export type BgField = 'blur' | 'brightness';

export const BG_BLUR_RANGE = { static: 100, kawarp: 100, tiles: 150 } as const;

export function readBackgroundAppearance(surface: BgSurface, field: BgField): number {
  const spec = BG_SURFACES[surface];
  const key = field === 'blur' ? spec.blurKey : spec.brightnessKey;
  return readNum(key, spec.defaults[field]);
}

export function readAllBackgroundAppearance(): Record<BgSurface, Record<BgField, number>> {
  const all = {} as Record<BgSurface, Record<BgField, number>>;
  for (const surface of Object.keys(BG_SURFACES) as BgSurface[]) {
    all[surface] = {
      blur: readBackgroundAppearance(surface, 'blur'),
      brightness: readBackgroundAppearance(surface, 'brightness'),
    };
  }
  return all;
}

export function applyBackgroundAppearance(): void {
  const style = document.documentElement.style;
  const write = (name: string, value: string) => {
    if (!name) return;
    if (style.getPropertyValue(name) === value) return;
    style.setProperty(name, value);
  };

  for (const surface of Object.keys(BG_SURFACES) as BgSurface[]) {
    const spec = BG_SURFACES[surface];
    write(spec.blurVar, `${readBackgroundAppearance(surface, 'blur')}px`);
    write(spec.brightnessVar, `${readBackgroundAppearance(surface, 'brightness')}%`);
  }
}

export function setBackgroundAppearance(surface: BgSurface, field: BgField, value: number): void {
  const spec = BG_SURFACES[surface];
  localStorage.setItem(field === 'blur' ? spec.blurKey : spec.brightnessKey, String(value));
  applyBackgroundAppearance();
  window.dispatchEvent(new Event('glowifyBackgroundChange'));
}

export function resetBackgroundAppearance(): void {
  for (const surface of Object.keys(BG_SURFACES) as BgSurface[]) {
    const spec = BG_SURFACES[surface];
    localStorage.setItem(spec.blurKey, String(spec.defaults.blur));
    localStorage.setItem(spec.brightnessKey, String(spec.defaults.brightness));
  }
  localStorage.setItem(BG_ENGINE_KEY, 'kawarp');
  applyBackgroundAppearance();
}

export function ensureBackgroundAppearanceApplied(): void {
  applyBackgroundAppearance();
}
