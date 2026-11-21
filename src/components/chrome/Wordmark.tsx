"use client";

import { site } from "@/content/site";
import { isCinematic } from "@/lib/a11y";
import { scrollToTop } from "@/lib/director";
import { cn } from "@/lib/utils";
import { useExperience } from "@/store/experience";

/** Top-left HASI (Design.md §6). Click → back to the first frame. */
export default function Wordmark() {
  const loaded = useExperience((s) => s.loaderState !== "loading");
  return (
    <button
      type="button"
      onClick={() =>
        isCinematic() ? scrollToTop() : window.scrollTo({ top: 0, behavior: "smooth" })
      }
      aria-label={`${site.brand} — back to the top`}
      className={cn(
        "chrome-fade fixed flex min-h-[44px] items-center font-display text-[18px] leading-none font-extrabold tracking-[-0.02em] text-[color:var(--chrome-fg)] [font-stretch:125%]",
        loaded ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      style={{
        top: "calc(14px + var(--safe-top))",
        left: "var(--edge-x)",
        zIndex: "var(--z-chrome)",
      }}
    >
      {site.wordmark}
    </button>
  );
}
