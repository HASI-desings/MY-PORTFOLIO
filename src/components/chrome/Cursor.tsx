"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/hooks/useReducedMotion";

const INTERACTIVE = "a, button, [role='button'], [data-cursor='hover'], input, label";

/**
 * Desktop fine-pointer cursor (Design.md §6): an 8px ice dot that tracks exactly and a 32px
 * ring that follows (lerp 0.18). Over anything interactive the ring grows to 56px and turns
 * red; over text-heavy areas the native cursor returns. Off on touch and reduced motion.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    const pos = { x: -100, y: -100 };
    const lag = { x: -100, y: -100 };
    let mode: "base" | "hover" | "text" | "hidden" = "hidden";
    let raf = 0;

    const setMode = (m: typeof mode) => {
      if (m === mode) return;
      mode = m;
      ring.current?.setAttribute("data-mode", m);
      dot.current?.setAttribute("data-mode", m);
    };
    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = e.target as Element | null;
      if (t?.closest(INTERACTIVE)) setMode("hover");
      else if (t?.closest("[data-cursor='text']")) setMode("text");
      else setMode("base");
    };
    const onLeave = () => setMode("hidden");
    const loop = () => {
      lag.x += (pos.x - lag.x) * 0.18;
      lag.y += (pos.y - lag.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: "var(--z-cursor)" }}
    >
      <div ref={ring} className="cursor-ring" data-mode="hidden" />
      <div ref={dot} className="cursor-dot" data-mode="hidden" />
    </div>
  );
}
