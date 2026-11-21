"use client";

import { useSceneTimeline } from "@/hooks/useScene";
import SceneShell from "../SceneShell";

// TEMPORARY placeholder while the engine is verified — replaced by the full scene.
export default function Scene06Final() {
  useSceneTimeline("final", () => undefined);
  return (
    <SceneShell id="final" label="Contact">
      <p className="t-display absolute left-[var(--edge-x)] top-1/3 text-[length:var(--fs-h1)]">
        Contact
      </p>
    </SceneShell>
  );
}
