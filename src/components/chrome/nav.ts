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
  if (focusCta) {
    window.setTimeout(
      () => document.getElementById("cta")?.focus({ preventScroll: true }),
      immediate ? 120 : 1600,
    );
  }
}
