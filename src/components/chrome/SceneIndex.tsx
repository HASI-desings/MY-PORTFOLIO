"use client";

import { useEffect, useRef } from "react";
import { director, subscribe } from "@/lib/director";
import { cn } from "@/lib/utils";
import { useExperience } from "@/store/experience";
import { goToScene, sceneNames } from "./nav";

/**
 * Desktop/tablet: vertical 01–0N rail on the right edge; active number in ice with a red
 * hairline. Phones: a 2px red progress bar across the very top (Design.md §6).
 */
export default function SceneIndex() {
  const scenes = useExperience((s) => s.scenes);
  const active = useExperience((s) => s.activeScene);
  const loaded = useExperience((s) => s.loaderState !== "loading");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      subscribe(() => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${director.pageProgress})`;
      }),
    [],
  );

  return (
    <>
      <nav
        aria-label="Scenes"
        className={cn(
          "chrome-fade cine-only fixed top-1/2 hidden -translate-y-1/2 sm:block",
          loaded ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{ right: "calc(var(--edge-x-r) * 0.5)", zIndex: "var(--z-chrome)" }}
      >
        <ol className="scene-rail flex flex-col items-end">
          {scenes.map((id, i) => {
            const isActive = id === active;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => goToScene(id)}
                  aria-label={`Scene ${String(i + 1).padStart(2, "0")}: ${sceneNames[id]}`}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "t-mono group flex min-h-[32px] min-w-[44px] items-center justify-end gap-2 text-[11px] transition-colors duration-[var(--dur-short)]",
                    isActive
                      ? "text-[color:var(--chrome-fg)]"
                      : "text-[color:var(--chrome-fg-dim)] hover:text-[color:var(--chrome-fg)]",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-px origin-right bg-red transition-transform duration-[var(--dur-short)] ease-[var(--ease-out)]",
                      isActive ? "w-6 scale-x-100" : "w-6 scale-x-0",
                    )}
                  />
                  {String(i + 1).padStart(2, "0")}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      <div
        aria-hidden="true"
        className="cine-only fixed inset-x-0 top-0 h-[2px] sm:hidden"
        style={{ zIndex: "var(--z-chrome)", paddingTop: "var(--safe-top)" }}
      >
        <div
          ref={barRef}
          className="h-full origin-left bg-red"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </>
  );
}
