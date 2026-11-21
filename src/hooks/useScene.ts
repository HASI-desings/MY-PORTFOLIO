"use client";

import { useEffect, useRef } from "react";
import { director, registerScene, subscribe, type BuildContext } from "@/lib/director";
import { useExperience, type SceneId } from "@/store/experience";

type Builder = (tl: gsap.core.Timeline, ctx: BuildContext) => void;

/**
 * Registers a scene's scroll timeline with the director. The builder receives a timeline
 * that spans 0 → 1 (the scene's whole pin) and is rebuilt on resize, so it should read
 * refs and sizes fresh each time. Only runs in cinematic mode.
 */
export function useSceneTimeline(
  id: SceneId,
  build: Builder,
  options: { snap?: (ctx: BuildContext) => number[] } = {},
) {
  const buildRef = useRef(build);
  const snapRef = useRef(options.snap);
  useEffect(() => {
    buildRef.current = build;
    snapRef.current = options.snap;
  });

  useEffect(() => {
    if (!document.documentElement.classList.contains("cine")) return;
    return registerScene(id, {
      build: (tl, ctx) => buildRef.current(tl, ctx),
      snap: snapRef.current ? (ctx) => snapRef.current!(ctx) : undefined,
    });
  }, [id]);
}

/** Calls `fn(progress)` on every director update (imperative — no React re-render). */
export function useSceneProgress(id: SceneId, fn: (p: number) => void) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });
  useEffect(() => {
    const run = () => fnRef.current(director.progress[id] ?? 0);
    run();
    return subscribe(run);
  }, [id]);
}

export const useActiveScene = () => useExperience((s) => s.activeScene);
export const useIsActive = (id: SceneId) => useExperience((s) => s.activeScene === id);
