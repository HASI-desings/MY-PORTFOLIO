"use client";

import { useRef, useState, type ComponentType } from "react";
import MonoLabel from "@/components/ui/MonoLabel";
import { createScene, disciplines } from "@/content/disciplines";
import { useIsActive, useSceneProgress, useSceneTimeline } from "@/hooks/useScene";
import { useHorizontalChapters, useMode } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { useExperience } from "@/store/experience";
import type { DisciplineVisual } from "@/types/content";
import SceneShell from "../SceneShell";
import Chapter from "./Chapter";
import VisualAgents, { buildAgents } from "./visuals/VisualAgents";
import VisualDesign, { buildDesign } from "./visuals/VisualDesign";
import VisualPOS, { buildPOS } from "./visuals/VisualPOS";
import VisualSaaS, { buildSaaS } from "./visuals/VisualSaaS";
import VisualTrading, { buildTrading } from "./visuals/VisualTrading";
import VisualWeb, { buildWeb } from "./visuals/VisualWeb";
import type { VisualBuild, VisualProps } from "./visuals/types";

const VISUALS: Record<DisciplineVisual, [ComponentType<VisualProps>, VisualBuild]> = {
  web: [VisualWeb, buildWeb],
  agents: [VisualAgents, buildAgents],
  saas: [VisualSaaS, buildSaaS],
  pos: [VisualPOS, buildPOS],
  trading: [VisualTrading, buildTrading],
  design: [VisualDesign, buildDesign],
};

const COUNT = disciplines.length;

/**
 * SCENE 03 — WHAT I CREATE (Design.md §9). Six chapters, each with its own live visual —
 * never six identical cards. Desktop: the track slides left one chapter at a time inside the
 * pin. Phones: chapters stack vertically and snap. Each chapter: 0–25 % title + line rise,
 * 25–75 % its visual runs (scrubbed, reversible), 75–100 % it exits at 0.96 as the next
 * arrives. Six progress segments along the bottom.
 */
export default function Scene03Create() {
  const horizontal = useHorizontalChapters();
  const tier = useExperience((s) => s.tier);
  const lite = tier === "low" || tier === "none";
  const sceneActive = useIsActive("create");
  const index = useExperience((s) => s.scenes.indexOf("create"));
  const trackRef = useRef<HTMLDivElement>(null);
  const segRef = useRef<HTMLOListElement>(null);
  const [chapter, setChapter] = useState(0);
  const chapterRef = useRef(0);

  useSceneProgress("create", (p) => {
    const c = Math.min(COUNT - 1, Math.floor(p * COUNT));
    if (c !== chapterRef.current) {
      chapterRef.current = c;
      setChapter(c);
    }
    segRef.current
      ?.querySelectorAll("li")
      .forEach((li, i) => li.toggleAttribute("data-on", i === c));
  });

  // Static mode (no scroll engine): chapters are simply stacked; their loops may run.
  const staticMode = useMode() === "static";

  useSceneTimeline(
    "create",
    (tl, ctx) => {
      const track = trackRef.current;
      if (!track) return;
      const chapters = Array.from(track.querySelectorAll<HTMLElement>(".chapter"));
      const step = 1 / COUNT;
      const axis = ctx.mobile ? "y" : "x";
      const dist = ctx.mobile ? ctx.vh : ctx.vw;
      tl.set(track, { x: 0, y: 0 }, 0);

      chapters.forEach((el, i) => {
        const start = i * step;
        const w = { start, span: step };
        // Title + line mask-rise.
        const lines = el.querySelectorAll(".chapter-copy .mask-line__inner");
        const ghost = el.querySelector(".chapter-index");
        tl.fromTo(
          lines,
          { y: 0, yPercent: 110 },
          { y: 0, yPercent: 0, ease: "expo.out", duration: step * 0.2, stagger: step * 0.03 },
          start + step * 0.02,
        );
        if (ghost)
          tl.fromTo(
            ghost,
            { autoAlpha: 0, x: -30 },
            { autoAlpha: 1, x: 0, ease: "expo.out", duration: step * 0.25 },
            start,
          );
        // The chapter's own visual.
        const visual = el.querySelector<HTMLElement>(".chapter-visual");
        const id = el.dataset.chapter as DisciplineVisual;
        if (visual && VISUALS[id]) VISUALS[id][1](visual, tl, w, ctx);
        // Exit: slide to the next chapter, outgoing settles back to 0.96.
        if (i < COUNT - 1) {
          tl.fromTo(
            el,
            { scale: 1, autoAlpha: 1 },
            { scale: 0.96, autoAlpha: 0.35, ease: "power2.inOut", duration: step * 0.25 },
            start + step * 0.75,
          );
          tl.fromTo(
            track,
            { [axis]: -i * dist },
            { [axis]: -(i + 1) * dist, ease: "power3.inOut", duration: step * 0.25 },
            start + step * 0.75,
          );
        }
      });
    },
    { snap: (ctx) => (ctx.mobile ? disciplines.map((_, i) => (i + 0.5) / COUNT) : []) },
  );

  return (
    <SceneShell id="create" label="What I create">
      <div
        className="absolute"
        style={{
          left: "var(--edge-x)",
          top: "calc(clamp(72px, 12svh, 120px) + var(--safe-top))",
          zIndex: "var(--z-scene-fg)",
        }}
      >
        <MonoLabel tone="dim" as="h2">
          {String(index + 1).padStart(2, "0")} — {createScene.label}
        </MonoLabel>
      </div>

      <div ref={trackRef} className={cn("create-track", horizontal ? "is-h" : "is-v")}>
        {disciplines.map((d, i) => {
          const [Visual] = VISUALS[d.visualId];
          const active = staticMode || (sceneActive && chapter === i);
          return (
            <Chapter key={d.visualId} discipline={d}>
              <Visual active={active} lite={lite} />
            </Chapter>
          );
        })}
      </div>

      <ol
        ref={segRef}
        aria-hidden="true"
        className="cine-only absolute flex gap-1.5"
        style={{
          left: "var(--edge-x)",
          right: "var(--edge-x-r)",
          bottom: "calc(56px + var(--safe-bottom))",
          zIndex: "var(--z-scene-fg)",
        }}
      >
        {disciplines.map((d, i) => (
          <li
            key={d.visualId}
            data-on={i === 0 ? "" : undefined}
            className="create-seg h-[2px] flex-1 bg-ice-30"
          />
        ))}
      </ol>
    </SceneShell>
  );
}
