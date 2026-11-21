"use client";

import { useEffect, useRef } from "react";
import MaskText from "@/components/ui/MaskText";
import MonoLabel from "@/components/ui/MonoLabel";
import { toolkitScene } from "@/content/toolkit";
import { useSceneTimeline } from "@/hooks/useScene";
import { useThreeEnabled } from "@/hooks/useTier";
import { useWide } from "@/hooks/useReducedMotion";
import { useExperience } from "@/store/experience";
import SceneShell from "../SceneShell";
import ToolkitA11yList from "./ToolkitA11yList";
import Toolkit2D from "./Toolkit2D";
import ToolLabel from "./ToolLabel";

/**
 * SCENE 02 — THE TOOLKIT (Design.md §9). The room becomes a workspace: the Core rises,
 * the tools he really uses fly in one by one and float in three depth rings; the camera
 * orbits; a depth push carries you into Scene 03. Phones and the lite tier get the 2.5D
 * DOM version with the same tap / focus behaviour.
 *
 * Scroll timeline: 0–15 % Core rises + title mask-rises · 15–60 % tools enter (140 ms
 * stagger) · 60–90 % camera orbit · 90–100 % hold before the depth push.
 */
export default function Scene02Toolkit() {
  const three = useThreeEnabled();
  const wide = useWide();
  const use3D = three && wide;
  const index = useExperience((s) => s.scenes.indexOf("toolkit"));
  const titleRef = useRef<HTMLDivElement>(null);
  const field2D = useRef<HTMLDivElement>(null);
  const use3DRef = useRef(use3D);
  useEffect(() => {
    use3DRef.current = use3D;
  }, [use3D]);

  useSceneTimeline("toolkit", (tl, ctx) => {
    const lines = titleRef.current?.querySelectorAll(".mask-line__inner");
    if (lines?.length) {
      tl.fromTo(
        lines,
        { y: 0, yPercent: 110 },
        { y: 0, yPercent: 0, ease: "expo.out", duration: 0.12, stagger: 0.02 },
        0.01,
      );
    }
    const root = field2D.current;
    if (!root || use3DRef.current) return;
    const core = root.querySelector(".tk-core-wrap");
    if (core) tl.fromTo(core, { y: ctx.vh * 0.6 }, { y: 0, ease: "expo.out", duration: 0.15 }, 0);
    const items = root.querySelectorAll<HTMLElement>(".tk-item");
    items.forEach((item, i) => {
      tl.fromTo(
        item,
        { autoAlpha: 0, scale: 0.6, yPercent: 60 },
        { autoAlpha: 1, scale: 1, yPercent: 0, ease: "expo.out", duration: 0.12 },
        0.15 + i * 0.02,
      );
    });
    // Depth parallax: near tiles travel further than far ones.
    const layers: [string, number][] = [
      [".tk-near", -0.1],
      [".tk-mid", -0.05],
      [".tk-far", -0.02],
    ];
    for (const [sel, amount] of layers) {
      const els = root.querySelectorAll(sel);
      if (els.length) {
        tl.fromTo(els, { y: 0 }, { y: amount * ctx.vh, ease: "none", duration: 0.45 }, 0.55);
      }
    }
  });

  return (
    <SceneShell id="toolkit" label="Toolkit">
      <div
        ref={titleRef}
        className="absolute flex flex-col gap-3"
        style={{
          left: "var(--edge-x)",
          top: "calc(clamp(72px, 12svh, 120px) + var(--safe-top))",
          zIndex: "var(--z-scene-fg)",
        }}
      >
        <MonoLabel tone="dim" className="reveal">
          {String(index + 1).padStart(2, "0")} — {toolkitScene.label}
        </MonoLabel>
        <MaskText
          as="h2"
          lines={[toolkitScene.title]}
          className="t-display reveal text-[length:var(--fs-h1)] text-ice"
        />
      </div>

      {use3D ? (
        <>
          <ToolLabel />
          <ToolkitA11yList />
        </>
      ) : (
        <Toolkit2D ref={field2D} />
      )}
    </SceneShell>
  );
}
