"use client";

import { chrome } from "@/content/final";
import { cn } from "@/lib/utils";
import { useExperience } from "@/store/experience";
import { goToScene } from "./nav";

/** Top-right LET'S TALK — always reachable until the contact scene itself (Security.md §8). */
export default function TalkLink() {
  const hidden = useExperience((s) => s.activeScene === "final" || s.loaderState === "loading");
  return (
    <a
      href="#scene-final"
      onClick={(e) => {
        e.preventDefault();
        goToScene("final", { focusCta: true });
      }}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        "chrome-fade t-mono draw-line fixed flex min-h-[44px] items-center text-[12px] text-[color:var(--chrome-fg)]",
        hidden ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      style={{
        top: "calc(14px + var(--safe-top))",
        right: "var(--edge-x-r)",
        zIndex: "var(--z-chrome)",
      }}
    >
      {chrome.talk}
    </a>
  );
}
