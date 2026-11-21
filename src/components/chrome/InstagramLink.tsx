"use client";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { useExperience } from "@/store/experience";

/** Bottom-left Instagram — quiet, always there except during the loader. */
export default function InstagramLink() {
  const loaded = useExperience((s) => s.loaderState !== "loading");
  return (
    <a
      href={site.contact.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`IG / @${site.contact.instagramHandle} — Instagram (opens in a new tab)`}
      className={cn(
        "chrome-fade chrome-chip t-mono group fixed flex min-h-[44px] items-center gap-2 text-[11px] text-[color:var(--chrome-fg-dim)] transition-colors duration-[var(--dur-micro)] hover:text-[color:var(--chrome-fg)]",
        loaded ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      style={{
        bottom: "calc(12px + var(--safe-bottom))",
        left: "var(--edge-x)",
        zIndex: "var(--z-chrome)",
      }}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 scale-0 bg-red transition-transform duration-[var(--dur-micro)] group-hover:scale-100"
      />
      IG / @{site.contact.instagramHandle}
    </a>
  );
}
