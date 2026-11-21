"use client";

import { useEffect, useState } from "react";
import { chrome } from "@/content/final";
import { useFinePointer } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { useExperience } from "@/store/experience";

/** Scene 01 only: SCROLL / SWIPE with a red segment travelling down a hairline. */
export default function ScrollCue() {
  const loaded = useExperience((s) => s.loaderState === "done");
  const [scrolled, setScrolled] = useState(false);
  const touch = !useFinePointer();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "chrome-fade cine-only pointer-events-none fixed left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 short:hidden",
        loaded && !scrolled ? "opacity-100" : "opacity-0",
      )}
      style={{ bottom: "calc(20px + var(--safe-bottom))", zIndex: "var(--z-chrome)" }}
    >
      <span className="chrome-chip t-mono text-[11px] text-[color:var(--chrome-fg-dim)]">
        {touch ? chrome.swipe : chrome.scroll}
      </span>
      <span className="scroll-cue-line relative block h-8 w-px overflow-hidden bg-[color:var(--chrome-fg-faint)]" />
    </div>
  );
}
