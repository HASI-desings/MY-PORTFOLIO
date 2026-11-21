import { forwardRef } from "react";
import MaskText from "@/components/ui/MaskText";
import { site } from "@/content/site";

/**
 * Name, roles and statement (Design.md §9 Scene 01): bottom-left inside grid cols 1–5.
 * The red diagonal runs underneath, so the block sits on a solid obsidian plate — a sharp
 * poster caption rather than a soft scrim (keeps ≥ 4.5:1 contrast, Security.md §8).
 * The page's single h1 lives here: HASI DESIGNS — Hussnain Sohail.
 */
const NameBlock = forwardRef<HTMLDivElement>(function NameBlock(_, ref) {
  return (
    <div
      ref={ref}
      data-intro
      className="reveal absolute flex w-[min(100%-2*var(--edge-x),46rem)] flex-col gap-3 bg-obsidian px-5 py-5 sm:px-7 sm:py-6 md:w-[min(44vw,40rem)]"
      style={{
        left: "var(--edge-x)",
        bottom: "calc(clamp(64px, 10svh, 112px) + var(--safe-bottom))",
        zIndex: "var(--z-scene-fg)",
      }}
    >
      <h1 className="t-display text-[length:var(--fs-h2)] leading-[0.95] text-ice [font-stretch:115%]">
        <span className="sr-only">{site.brand} — </span>
        <MaskText as="span" lines={[site.name]} className="block" />
      </h1>
      <MaskText lines={[site.roles.join(" / ")]} className="t-mono text-ice-60" />
      <MaskText
        lines={[site.statement]}
        className="max-w-[36ch] text-[length:var(--fs-body-l)] leading-[1.45] text-ice"
      />
    </div>
  );
});

export default NameBlock;
