import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

type Gsap = typeof import("gsap").gsap;
type Modules = { gsap: Gsap; ScrollTrigger: typeof ScrollTriggerType };

let modules: Modules | null = null;
let loading: Promise<Modules> | null = null;

/**
 * GSAP + ScrollTrigger, fetched while the loader runs instead of in the first bundle
 * (Rules.md §5.3) and registered once with the site's defaults.
 */
export function loadGsap(): Promise<Modules> {
  if (modules) return Promise.resolve(modules);
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    const { gsap } = g;
    const { ScrollTrigger } = st;
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "none", duration: 1 });
    // Resizes are handled by the director (debounced, progress-preserving).
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });
    modules = { gsap, ScrollTrigger };
    return modules;
  });
  return loading;
}

/** The loaded modules. Only call once loadGsap() has resolved (the director guarantees it). */
export function getGsap(): Modules {
  if (!modules) throw new Error("GSAP not loaded yet");
  return modules;
}

export const gsapReady = () => modules !== null;
