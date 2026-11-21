"use client";

import { useSceneTimeline } from "@/hooks/useScene";
import SceneShell from "../SceneShell";

// TEMPORARY placeholder while the engine is verified — replaced by the full scene.
export default function Scene05Philosophy() {
  useSceneTimeline("philosophy", () => undefined);
  return (
    <SceneShell id="philosophy" label="Philosophy">
      <p className="t-display absolute left-[var(--edge-x)] top-1/3 text-[length:var(--fs-h1)]">
        Philosophy
      </p>
    </SceneShell>
  );
}
