"use client";

import { useSyncExternalStore } from "react";

function mediaStore(query: string) {
  return {
    subscribe(cb: () => void) {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    get: () => window.matchMedia(query).matches,
  };
}

const reduced = mediaStore("(prefers-reduced-motion: reduce)");
const fine = mediaStore("(hover: hover) and (pointer: fine)");
const wide = mediaStore("(min-width: 640px)");
// Mirrors director.ts BuildContext.mobile: horizontal chapters on laptops and landscape tablets.
const horizontal = mediaStore(
  "(min-width: 1024px), (min-width: 640px) and (orientation: landscape)",
);
const noop = () => () => undefined;

/** Live `prefers-reduced-motion` (false on the server). */
export function useReducedMotion() {
  return useSyncExternalStore(reduced.subscribe, reduced.get, () => false);
}

/** Mouse/trackpad (true) vs touch (false). False on the server. */
export function useFinePointer() {
  return useSyncExternalStore(fine.subscribe, fine.get, () => false);
}

/**
 * The experience mode chosen in <head> before first paint: "cine" | "static", or null on
 * the server / during hydration (so server and first client render always match).
 */
export function useMode(): "cine" | "static" | null {
  return useSyncExternalStore(
    noop,
    () => (document.documentElement.classList.contains("cine") ? "cine" : "static"),
    () => null,
  );
}

/** ≥ 640 px wide — where the 3D toolkit is allowed (Security.md §5). */
export function useWide() {
  return useSyncExternalStore(wide.subscribe, wide.get, () => true);
}

/** Scene 03 chapters run horizontally (desktop, landscape tablets) or vertically (phones). */
export function useHorizontalChapters() {
  return useSyncExternalStore(horizontal.subscribe, horizontal.get, () => true);
}
