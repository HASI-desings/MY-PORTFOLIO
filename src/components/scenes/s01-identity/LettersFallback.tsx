"use client";

import { forwardRef } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

interface LettersFallbackProps {
  /** Flat ice letters: the loader handoff target, hidden once the 3D letters take over. */
  flatHidden: boolean;
  /** Faux-3D layer (layered shadows) for lite / no-WebGL. */
  depthVisible: boolean;
}

/**
 * The DOM HASI. It is three things at once: the loader's landing slot, the measurement the
 * 3D letters are placed from, and the lite / no-WebGL version with faux depth.
 */
const LettersFallback = forwardRef<HTMLDivElement, LettersFallbackProps>(function LettersFallback(
  { flatHidden, depthVisible },
  ref,
) {
  const letters = Array.from(site.wordmark);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="hasi-slot-wrap pointer-events-none absolute inset-x-0 flex justify-center"
      style={{ bottom: "38%" }}
    >
      <div className="relative">
        <p
          data-hasi-slot
          className="t-hasi relative whitespace-nowrap text-[length:var(--fs-mega)] max-[379px]:text-[34vw]"
        >
          <span
            className={cn(
              "hasi-flat relative block text-ice transition-opacity duration-500",
              flatHidden && "opacity-0",
            )}
          >
            {letters.map((ch, i) => (
              <span key={i} data-letter className="letter">
                {ch}
              </span>
            ))}
            <span data-baseline className="inline-block h-0 w-0 align-baseline" />
          </span>
          <span
            className={cn(
              "hasi-depth pointer-events-auto absolute inset-0 block transition-opacity duration-700",
              depthVisible ? "opacity-100" : "opacity-0",
            )}
          >
            {letters.map((ch, i) => (
              <span key={i} className="letter">
                {ch}
              </span>
            ))}
          </span>
        </p>
      </div>
    </div>
  );
});

export default LettersFallback;
