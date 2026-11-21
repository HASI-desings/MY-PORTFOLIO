"use client";

import { chrome } from "@/content/final";
import { goToScene } from "./nav";

/** First focusable element on the page (Design.md §11). */
export default function SkipLink() {
  return (
    <a
      href="#scene-final"
      onClick={(e) => {
        e.preventDefault();
        goToScene("final", { focusCta: true, immediate: true });
      }}
      className="t-mono fixed left-4 top-4 -translate-y-[200%] bg-ice px-4 py-3 text-obsidian focus:translate-y-0"
      style={{ zIndex: "var(--z-cursor)" }}
    >
      {chrome.skip}
    </a>
  );
}
