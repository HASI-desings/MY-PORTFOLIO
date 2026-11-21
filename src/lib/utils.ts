export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Maps v from [inMin, inMax] to [outMin, outMax], clamped. */
export const map = (v: number, inMin: number, inMax: number, outMin = 0, outMax = 1) =>
  outMin + (outMax - outMin) * clamp((v - inMin) / (inMax - inMin || 1));

/** Local 0..1 progress of a sub-range [start, end] inside a 0..1 progress. */
export const range = (p: number, start: number, end: number) => clamp((p - start) / (end - start));

export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type ClassValue = string | false | null | undefined;
export const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(" ");

/** Deterministic pseudo-random generator (mulberry32) — same layout on every render. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
