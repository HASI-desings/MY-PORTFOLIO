import type { BuildContext } from "@/lib/director";

/** Window of the chapter's own scroll inside the Scene 03 timeline. */
export interface ChapterWindow {
  /** Scene-progress where this chapter starts. */
  start: number;
  /** Scene-progress span of this chapter. */
  span: number;
}

/**
 * Adds a visual's scroll-scrubbed tweens to the scene timeline. Markup is authored in its
 * finished state (static mode and no-JS show it as-is); builders animate *from* the
 * unbuilt state with fromTo, so everything rewinds cleanly.
 */
export type VisualBuild = (
  root: HTMLElement,
  tl: gsap.core.Timeline,
  at: ChapterWindow,
  ctx: BuildContext,
) => void;

export interface VisualProps {
  /** The chapter is on screen — idle loops may run. */
  active: boolean;
  /** Lite tier: no idle loops, scroll reveals only. */
  lite: boolean;
}

/** Position inside a chapter window: f = 0…1 of that chapter. */
export const at = (w: ChapterWindow, f: number) => w.start + w.span * f;
export const len = (w: ChapterWindow, f: number) => w.span * f;
