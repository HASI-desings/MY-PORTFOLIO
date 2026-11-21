"use client";

import { tierSettings } from "@/lib/tier";
import { useExperience } from "@/store/experience";

/** Static film grain over everything (Design.md §6). Off on the low tier. */
export default function Grain() {
  const on = useExperience((s) => tierSettings[s.tier].grain);
  if (!on) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-overlay"
      style={{
        zIndex: "var(--z-grain)",
        backgroundImage: "url(/textures/grain.png)",
        backgroundSize: "256px 256px",
      }}
    />
  );
}
