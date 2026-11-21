import { isCinematic } from "@/lib/a11y";
import { scrollToScene } from "@/lib/director";
import type { SceneId } from "@/store/experience";

export const sceneNames: Record<SceneId, string> = {
  identity: "Identity",
  toolkit: "Toolkit",
  create: "What I create",
  projects: "Selected projects",
  philosophy: "Philosophy",
  final: "Contact",
};

/** Go to a scene in either mode; for the final scene, land on the CTA and focus it. */
export function goToScene(id: SceneId, opts: { focusCta?: boolean; immediate?: boolean } = {}) {
  const { focusCta = false, immediate = false } = opts;
  if (isCinematic()) {
    scrollToScene(id, id === "final" ? 0.92 : 0.02, immediate);
  } else {
    document
      .getElementById(`scene-${id}`)
      ?.scrollIntoView({ behavior: immediate ? "instant" : "smooth" });
  }
  if (focusCta) focusWhenReady("cta", immediate ? 0 : 1200);
}

/**
 * Focuses an element as soon as it can actually take focus: the CTA only becomes visible
 * (and its scene stops being inert) once the scroll has arrived. Tries for up to 3 s.
 */
export function focusWhenReady(id: string, delay: number) {
  const started = performance.now();
  const attempt = () => {
    const el = document.getElementById(id);
    el?.focus({ preventScroll: true });
    if (document.activeElement === el || performance.now() - started > 3000 + delay) return;
    window.setTimeout(attempt, 100);
  };
  window.setTimeout(attempt, delay);
}
