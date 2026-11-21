/**
 * Asset manifest + real progress (Security.md §4).
 * - Progress is the weighted share of items finished, plus real byte progress for fetches.
 * - Every item has a timeout and up to 2 retries (800 ms, 2000 ms). An item that still
 *   fails is marked missing and the site continues with that component's fallback.
 */
import type { Tier } from "@/store/experience";
import { loadGsap } from "./gsap";
import { tierSettings } from "./tier";

export interface PreloadItem {
  id: string;
  weight: number;
  load: (onProgress: (fraction: number) => void) => Promise<unknown>;
}

export interface PreloadResult {
  failed: string[];
}

/** Loaded assets shared with the components that need them (no double fetch). */
export const assets: { typeface: unknown | null } = { typeface: null };

let typefacePromise: Promise<unknown> | null = null;

/** The 3D typeface JSON, fetched once and shared by the loader and the HASI letters. */
export function getTypeface(onProgress: (f: number) => void = () => undefined) {
  typefacePromise ??= fetchWithProgress("/fonts/archivo-black.typeface.json", onProgress).then(
    (buf) => {
      assets.typeface = JSON.parse(new TextDecoder().decode(buf));
      return assets.typeface;
    },
  );
  typefacePromise.catch(() => {
    typefacePromise = null; // allow a retry
  });
  return typefacePromise;
}

const TIMEOUT_MS = 15000;

/** next/font hashes family names; the real one is in its CSS variable. */
export function cssFontFamily(variable: string) {
  return (
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || "sans-serif"
  );
}
const RETRY_DELAYS = [800, 2000];

function withTimeout<T>(p: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const t = window.setTimeout(() => reject(new Error("timeout")), ms);
    p.then(
      (v) => {
        window.clearTimeout(t);
        resolve(v);
      },
      (e) => {
        window.clearTimeout(t);
        reject(e);
      },
    );
  });
}

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

/** fetch() with byte-level progress when the server sends Content-Length. */
export async function fetchWithProgress(url: string, onProgress: (f: number) => void) {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const total = Number(res.headers.get("content-length")) || 0;
  if (!res.body || !total) {
    const buf = await res.arrayBuffer();
    onProgress(1);
    return buf;
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(Math.min(received / total, 1));
  }
  const out = new Uint8Array(received);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  onProgress(1);
  return out.buffer;
}

function loadImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`image ${src}`));
    img.src = src;
  });
}

/** What the first screens need for a given tier. The portrait (Scene 06) loads later. */
export function manifestFor(tier: Tier): PreloadItem[] {
  const items: PreloadItem[] = [
    {
      id: "fonts",
      weight: 12,
      load: async () => {
        await Promise.all([
          document.fonts.load(`900 1em ${cssFontFamily("--font-archivo")}`),
          document.fonts.load(`400 1em ${cssFontFamily("--font-geist")}`),
          document.fonts.load(`400 1em ${cssFontFamily("--font-geist-mono")}`),
        ]).catch(() => undefined);
        await document.fonts.ready;
      },
    },
  ];
  // The scroll engine (GSAP, ScrollTrigger, Lenis) — needed by every tier.
  items.push({
    id: "motion",
    weight: 10,
    load: () => Promise.all([loadGsap(), import("lenis")]),
  });
  const settings = tierSettings[tier];
  if (settings.three) {
    items.push(
      { id: "three", weight: 34, load: () => import("three") },
      { id: "r3f", weight: 16, load: () => import("@react-three/fiber") },
      { id: "stage", weight: 18, load: () => import("@/components/three/Stage") },
      {
        id: "typeface",
        weight: 12,
        load: (onProgress) => getTypeface(onProgress),
      },
    );
  }
  if (settings.grain) {
    items.push({ id: "grain", weight: 4, load: () => loadImage("/textures/grain.png") });
  }
  return items;
}

/**
 * Loads every item in parallel. `onProgress` receives 0–1; it reaches 1 only when every
 * item has finished or definitively failed.
 */
export async function runPreload(
  items: PreloadItem[],
  onProgress: (p: number) => void,
): Promise<PreloadResult> {
  const totalWeight = items.reduce((s, i) => s + i.weight, 0) || 1;
  const fractions = new Map(items.map((i) => [i.id, 0]));
  const report = () => {
    let sum = 0;
    for (const item of items) sum += item.weight * (fractions.get(item.id) ?? 0);
    onProgress(sum / totalWeight);
  };
  const failed: string[] = [];

  await Promise.all(
    items.map(async (item) => {
      for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
        try {
          await withTimeout(
            item.load((f) => {
              // Byte progress caps below 1 until the item really resolves.
              fractions.set(item.id, Math.min(f, 0.98));
              report();
            }),
            TIMEOUT_MS,
          );
          fractions.set(item.id, 1);
          report();
          return;
        } catch {
          if (attempt < RETRY_DELAYS.length) await wait(RETRY_DELAYS[attempt]);
        }
      }
      failed.push(item.id);
      fractions.set(item.id, 1); // counted as settled so the site never waits forever
      report();
    }),
  );
  return { failed };
}
