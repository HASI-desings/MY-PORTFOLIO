"use client";

import { Fragment, forwardRef } from "react";
import { philosophy } from "@/content/philosophy";
import { cn } from "@/lib/utils";

/** Renders the stacked statement as words → letters (identical in both layers). */
function Lines({ layer }: { layer: "dim" | "lit" }) {
  return (
    <>
      {philosophy.lines.map((line) => (
        <span
          key={line}
          className={cn(
            "philo-line relative block whitespace-nowrap",
            line === philosophy.underline && "is-underlined",
          )}
        >
          {line.split(" ").map((word, w, all) => (
            <Fragment key={w}>
              <span className="word" data-word>
                {Array.from(word).map((ch, i) => (
                  <span key={i} className="letter">
                    {ch}
                  </span>
                ))}
              </span>
              {w < all.length - 1 ? " " : null}
            </Fragment>
          ))}
          {layer === "dim" && line === philosophy.underline ? (
            <span className="philo-underline" />
          ) : null}
        </span>
      ))}
    </>
  );
}

/**
 * The giant philosophy line and its light (Design.md §9 Scene 05): an unlit layer at
 * ice-10 and a lit ice layer revealed by a narrow vertical beam — a CSS gradient mask whose
 * position (--beam) follows the newest word and the pointer, and whose floor (--lit) rises
 * to 1 when the whole line is lit.
 */
const LightBeam = forwardRef<HTMLDivElement>(function LightBeam(_, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="philo-block t-condensed relative text-[length:var(--fs-giant)]"
    >
      <div className="philo-dim text-ice-10">
        <Lines layer="dim" />
      </div>
      <div className="philo-lit absolute inset-0 text-ice">
        <Lines layer="lit" />
      </div>
    </div>
  );
});

export default LightBeam;
