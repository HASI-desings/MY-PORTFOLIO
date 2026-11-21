"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { getGsap } from "@/lib/gsap";
import { manifestFor, runPreload } from "@/lib/preload";
import { connectionIsSlow } from "@/lib/tier";
import { useExperience } from "@/store/experience";
import { useMode } from "@/hooks/useReducedMotion";
import SlowNotice from "./SlowNotice";

const MIN_VISIBLE_MS = 1200;

/**
 * The loader (Design.md §9): HASI as a 1px outline that fills with ice from the bottom as
 * real assets arrive; a monotonic counter; a red line along the bottom edge. On exit the
 * filled letters travel to their Scene 01 position — the Scene 01 letters ARE these letters.
 */
export default function Loader() {
  const tier = useExperience((s) => s.tier);
  const loaderState = useExperience((s) => s.loaderState);
  const setLoaderState = useExperience((s) => s.setLoaderState);
  const mode = useMode();

  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);

  const target = useRef(0);
  const shown = useRef(0);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  const [slow] = useState(() => (typeof navigator === "undefined" ? false : connectionIsSlow()));
  const startedAt = useRef(0);
  const exiting = useRef(false);

  // Real progress from the asset manifest for the detected tier.
  useEffect(() => {
    if (!document.documentElement.classList.contains("cine")) return;
    startedAt.current = performance.now();
    let cancelled = false;
    runPreload(manifestFor(useExperience.getState().tier), (p) => {
      target.current = Math.max(target.current, p);
    }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Eased, monotonic display (never jumps backward, never shows 100 before ready).
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const goal = ready ? 1 : Math.min(target.current, 0.99);
      shown.current = Math.max(shown.current, shown.current + (goal - shown.current) * 0.08);
      if (goal - shown.current < 0.001) shown.current = goal;
      const p = shown.current;
      if (counterRef.current)
        counterRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      if (fillRef.current)
        fillRef.current.style.clipPath = `inset(${((1 - p) * 100).toFixed(2)}% 0 0 0)`;
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${p})`;
      rootRef.current?.setAttribute("aria-valuenow", String(Math.round(p * 100)));
      if (!(ready && p >= 1)) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  const runExit = () => {
    const { gsap } = getGsap();
    const letters = lettersRef.current;
    const slot = document.querySelector<HTMLElement>("[data-hasi-slot]");
    const tl = gsap.timeline({
      onComplete: () => {
        setLoaderState("done");
        setGone(true);
      },
    });
    tl.to(
      [counterRef.current, footRef.current],
      { autoAlpha: 0, duration: 0.3, ease: "power2.out" },
      0,
    );
    tl.to(
      lineRef.current,
      { scaleX: 0, transformOrigin: "100% 50%", duration: 0.9, ease: "power3.inOut" },
      0.1,
    );
    if (letters && slot) {
      const a = letters.getBoundingClientRect();
      const b = slot.getBoundingClientRect();
      const scale = b.width / a.width;
      tl.to(
        letters,
        {
          x: b.left + b.width / 2 - (a.left + a.width / 2),
          y: b.top + b.height / 2 - (a.top + a.height / 2),
          scale,
          duration: 1.4,
          ease: "power3.inOut",
        },
        0.1,
      );
      tl.to(fillRef.current, { clipPath: "inset(0% 0 0 0)", duration: 0.2 }, 0.1);
    }
    tl.to(bgRef.current, { autoAlpha: 0, duration: 0.6, ease: "none" }, 0.95);
    tl.to(letters, { autoAlpha: 0, duration: 0.25, ease: "none" }, 1.5);
  };

  // Exit: wait for real readiness + the minimum display time, then hand off.
  useEffect(() => {
    const lite = tier === "low" || tier === "none";
    if ((!ready && !(lite && loaderState === "exiting")) || exiting.current) return;
    const delay = Math.max(0, MIN_VISIBLE_MS - (performance.now() - startedAt.current));
    const timer = window.setTimeout(
      () => {
        exiting.current = true;
        setLoaderState("exiting");
        runExit();
      },
      ready ? delay + 220 : 0,
    );
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runExit reads refs only
  }, [ready, tier, loaderState]);

  if (gone || mode === "static") return null;

  return (
    <div
      ref={rootRef}
      className="cine-only fixed inset-0"
      style={{ zIndex: "var(--z-loader)" }}
      role="progressbar"
      aria-label={`Loading ${site.brand}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div ref={bgRef} className="absolute inset-0 bg-obsidian" />
      <div className="absolute inset-0 grid place-items-center">
        <div
          ref={lettersRef}
          className="t-hasi relative text-[length:var(--fs-giant)] will-change-transform"
          aria-hidden="true"
        >
          <span className="block text-transparent [-webkit-text-stroke:1px_var(--ice-30)]">
            {site.wordmark}
          </span>
          <span
            ref={fillRef}
            className="absolute inset-0 block text-ice"
            style={{ clipPath: "inset(100% 0 0 0)" }}
          >
            {site.wordmark}
          </span>
        </div>
      </div>
      <div
        ref={footRef}
        className="absolute inset-x-0 flex items-end justify-between gap-6 px-[var(--edge-x)]"
        style={{ bottom: "calc(24px + var(--safe-bottom))" }}
      >
        <div className="flex flex-col gap-2">
          <SlowNotice />
          <span ref={counterRef} className="t-mono text-ice tabular-nums">
            000
          </span>
        </div>
        <span className="t-mono text-right text-ice-60">
          {slow ? "Lite mode for your connection" : `${site.brand} — ${site.locationShort}`}
        </span>
      </div>
      <div
        ref={lineRef}
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-red"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
