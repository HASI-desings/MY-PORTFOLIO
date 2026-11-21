export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const prefersMoreContrast = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-contrast: more)").matches;

export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** The experience mode picked in <head> before first paint (see app/layout.tsx). */
export const isCinematic = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("cine");
