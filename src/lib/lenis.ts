import type Lenis from "lenis";
import { hasFinePointer } from "./a11y";
import { getGsap } from "./gsap";

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

/**
 * Smooth wheel scrolling on desktop only (lerp 0.1 — weighty, never floaty). Touch keeps
 * native scrolling (Design.md §7). Driven by GSAP's ticker so Lenis and ScrollTrigger
 * share one frame clock. Loaded with GSAP, after first paint.
 */
export async function startLenis() {
  if (lenis || !hasFinePointer()) return lenis;
  const { default: LenisCtor } = await import("lenis");
  const { gsap, ScrollTrigger } = getGsap();
  lenis = new LenisCtor({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function stopLenis() {
  if (tick) getGsap().gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  tick = null;
}

export const getLenis = () => lenis;

/** Scrolls to a document offset — smooth (1.4 s) unless `immediate`. */
export function scrollToY(y: number, immediate = false) {
  if (lenis) {
    lenis.scrollTo(y, {
      immediate,
      duration: 1.4,
      easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    });
    return;
  }
  window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
}
