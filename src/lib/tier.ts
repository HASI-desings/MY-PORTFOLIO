import type { Tier } from "@/store/experience";
import { prefersReducedMotion } from "./a11y";

const LITE_KEY = "hasi-lite";

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

function connection(): NetworkInformationLike | undefined {
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

function webglVersion(): 0 | 1 | 2 {
  try {
    const canvas = document.createElement("canvas");
    if (canvas.getContext("webgl2")) return 2;
    if (canvas.getContext("webgl")) return 1;
  } catch {
    // Some privacy modes throw instead of returning null.
  }
  return 0;
}

/** Visitors who chose "lite version" (slow notice or error page) keep it for the session. */
export function rememberLite() {
  try {
    sessionStorage.setItem(LITE_KEY, "1");
  } catch {
    // Storage blocked — the choice simply isn't remembered.
  }
}

function liteRemembered() {
  try {
    return sessionStorage.getItem(LITE_KEY) === "1";
  } catch {
    return false;
  }
}

/** True when the connection asks for the lite tier (Security.md §7). */
export function connectionIsSlow() {
  const c = connection();
  return Boolean(c?.saveData || (c?.effectiveType && /(^|-)2g|3g/.test(c.effectiveType)));
}

/**
 * Quality tier (Security.md §5):
 *  high — WebGL2, ≥ 8 cores, fine pointer, no saveData
 *  mid  — WebGL2 on average devices / most phones
 *  low  — ≤ 4 GB memory, saveData, 2g/3g, no WebGL2, or the visitor chose lite
 *  none — no WebGL at all, or reduced motion
 * `?tier=` overrides for QA.
 */
export function detectTier(): Tier {
  const forced = new URLSearchParams(location.search).get("tier");
  if (forced === "high" || forced === "mid" || forced === "low" || forced === "none") return forced;

  if (prefersReducedMotion()) return "none";
  const gl = webglVersion();
  if (gl === 0) return "none";
  if (liteRemembered()) return "low";

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (connectionIsSlow() || (memory !== undefined && memory <= 4) || gl < 2) return "low";

  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return cores >= 8 && !coarse ? "high" : "mid";
}

/** True when the tier was forced with ?tier= (the FPS monitor then leaves it alone). */
export const tierForced = () => new URLSearchParams(location.search).has("tier");

export const tierSettings = {
  high: { dpr: 2, dust: 400, grain: true, three: true },
  mid: { dpr: 1.5, dust: 150, grain: true, three: true },
  low: { dpr: 1, dust: 0, grain: false, three: false },
  none: { dpr: 1, dust: 0, grain: false, three: false },
} as const;
