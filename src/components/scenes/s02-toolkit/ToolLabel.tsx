"use client";

import { toolkit } from "@/content/toolkit";
import { useExperience } from "@/store/experience";

/**
 * The T3 label of the hovered / focused / tapped tool (Design.md §9 Scene 02): mono group
 * caption, the tool's name and its one honest line. In 3D its position is written every
 * frame by the Stage (projected tile position); here it only renders the words.
 */
export default function ToolLabel() {
  const id = useExperience((s) => s.hoveredTool);
  const tool = toolkit.find((t) => t.id === id);
  return (
    <div
      id="tool-label"
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute left-0 top-0 w-[300px] opacity-0 transition-opacity duration-[var(--dur-short)]"
      style={{ zIndex: "var(--z-scene-fg)" }}
    >
      {tool ? (
        <div className="border-l border-red bg-obsidian/85 py-3 pl-4 pr-3">
          <p className="t-mono text-ice-60">{tool.group}</p>
          <p className="t-display mt-1 text-[length:var(--fs-h2)] text-ice [font-stretch:110%]">
            {tool.name}
          </p>
          <p className="mt-2 text-[length:var(--fs-small)] leading-snug text-ice-60">{tool.line}</p>
        </div>
      ) : null}
    </div>
  );
}
