"use client";

import { forwardRef, useEffect, useRef } from "react";
import { final } from "@/content/final";
import { useFinePointer, useReducedMotion } from "@/hooks/useReducedMotion";

interface CtaButtonProps {
  onActivate: () => void;
}

/**
 * LET'S MAKE IT REAL (Design.md §9): the single tactile red button. Hover lifts it 3 px,
 * deepens the glow, sweeps an ice sheen and rolls the label; press sinks it 2 px into
 * red-deep; within 80 px it leans toward the pointer (max 10 px, desktop only).
 */
const CtaButton = forwardRef<HTMLButtonElement, CtaButtonProps>(function CtaButton(
  { onActivate },
  ref,
) {
  const magnet = useRef<HTMLSpanElement>(null);
  const last = useRef(0);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = magnet.current;
    if (!el || !fine || reduced) return;
    let raf = 0;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const outside = Math.max(Math.abs(dx) - r.width / 2, Math.abs(dy) - r.height / 2, 0);
      const pull = outside < 80 ? 1 - outside / 80 : 0;
      target.x = Math.max(-10, Math.min(10, dx * 0.12 * pull));
      target.y = Math.max(-10, Math.min(10, dy * 0.2 * pull));
    };
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.15;
      cur.y += (target.y - cur.y) * 0.15;
      el.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [fine, reduced]);

  return (
    <span ref={magnet} className="inline-block will-change-transform">
      <button
        ref={ref}
        id="cta"
        type="button"
        className="cta"
        onClick={() => {
          // Double-click guard (Security.md §8): options open once.
          const now = performance.now();
          if (now - last.current < 400) return;
          last.current = now;
          onActivate();
        }}
      >
        <span className="cta__sheen" aria-hidden="true" />
        <span className="cta__roll">
          <span className="cta__text">{final.cta}</span>
          <span className="cta__text cta__text--next" aria-hidden="true">
            {final.cta}
          </span>
        </span>
      </button>
    </span>
  );
});

export default CtaButton;
