"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { toolkit } from "@/content/toolkit";
import { iconFor, monogramLines } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useExperience } from "@/store/experience";

/** Loose, asymmetric scatter around the Core: [x %, y %, depth 0 far · 1 mid · 2 near]. */
const SPOTS: [number, number, 0 | 1 | 2][] = [
  [18, 34, 2],
  [79, 29, 1],
  [29, 53, 1],
  [71, 47, 2],
  [11, 63, 0],
  [87, 61, 0],
  [23, 77, 2],
  [75, 73, 1],
  [40, 30, 0],
  [61, 25, 0],
  [9, 88, 1],
  [88, 85, 2],
  [45, 89, 0],
  [59, 80, 1],
  [91, 41, 1],
  [8, 46, 1],
  [33, 92, 1],
];

const depthClass = ["tk-far", "tk-mid", "tk-near"] as const;

/**
 * 2.5D toolkit for phones and the lite tier (Design.md §9): DOM tiles in depth layers around
 * a CSS Core. Tap / hover / focus a tile → it lifts, shows its brand colour and its label;
 * tap anywhere else to dismiss.
 */
const Toolkit2D = forwardRef<HTMLDivElement>(function Toolkit2D(_, ref) {
  const hovered = useExperience((s) => s.hoveredTool);
  const setHoveredTool = useExperience((s) => s.setHoveredTool);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [labelPos, setLabelPos] = useState<{ left: number; top: number; flip: boolean } | null>(
    null,
  );
  const tool = toolkit.find((t) => t.id === hovered);

  // Tap outside → dismiss.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.("[data-tool]")) setHoveredTool(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [setHoveredTool]);

  const activate = (id: string, el: HTMLElement) => {
    setHoveredTool(id);
    const field = fieldRef.current?.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (!field) return;
    const flip = r.right + 260 > field.right;
    setLabelPos({
      left: flip ? r.left - field.left - 12 : r.right - field.left + 12,
      top: Math.min(Math.max(r.top - field.top - 8, 8), field.height - 150),
      flip,
    });
  };

  return (
    <div ref={ref} className="absolute inset-0">
      <div ref={fieldRef} className="tk-field absolute inset-x-0 bottom-0 top-[22%] sm:top-[18%]">
        {/* The CSS Core: a slowly turning graphite monolith with red edges. */}
        <div
          aria-hidden="true"
          className="tk-core-wrap absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="tk-core">
            <span className="tk-face tk-f1" />
            <span className="tk-face tk-f2" />
            <span className="tk-face tk-f3" />
            <span className="tk-face tk-f4" />
          </div>
        </div>

        <ul aria-label="Tools I use" className="absolute inset-0">
          {toolkit.map((t, i) => {
            const [x, y, depth] = SPOTS[i] ?? [50, 50, 1];
            const icon = iconFor(t.simpleIconSlug);
            const active = hovered === t.id;
            return (
              <li
                key={t.id}
                className={cn("tk-item absolute", depthClass[depth])}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  ["--brand" as string]: icon?.hex ?? "var(--ice)",
                }}
              >
                <button
                  type="button"
                  data-tool={t.id}
                  aria-label={`${t.name} — ${t.group}. ${t.line}`}
                  aria-pressed={active}
                  onPointerEnter={(e) =>
                    e.pointerType === "mouse" && activate(t.id, e.currentTarget)
                  }
                  onPointerLeave={(e) => e.pointerType === "mouse" && setHoveredTool(null)}
                  onClick={(e) => activate(t.id, e.currentTarget)}
                  onFocus={(e) => activate(t.id, e.currentTarget)}
                  onBlur={() => setHoveredTool(null)}
                  className={cn("tk-tile", active && "is-active", hovered && !active && "is-dim")}
                >
                  {icon ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[46%] w-[46%]">
                      <path d={icon.path} fill="currentColor" />
                    </svg>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="t-hasi text-center text-[calc(var(--tile)*0.2)] leading-[0.95]"
                    >
                      {monogramLines(t.name).map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {tool && labelPos ? (
          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none absolute w-[min(240px,60vw)] border-l border-red bg-obsidian/90 py-3 pl-4 pr-3"
            style={{
              left: labelPos.left,
              top: labelPos.top,
              transform: labelPos.flip ? "translateX(-100%)" : undefined,
              zIndex: "var(--z-scene-fg)",
            }}
          >
            <p className="t-mono text-ice-60">{tool.group}</p>
            <p className="t-display mt-1 text-[1.35rem] leading-none text-ice [font-stretch:110%]">
              {tool.name}
            </p>
            <p className="mt-2 text-[length:var(--fs-small)] leading-snug text-ice-60">
              {tool.line}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
});

export default Toolkit2D;
