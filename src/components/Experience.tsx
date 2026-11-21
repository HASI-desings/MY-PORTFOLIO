"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect } from "react";
import { publishedProjects } from "@/content/projects";
import { setPaused, startDirector } from "@/lib/director";
import { detectTier, tierSettings } from "@/lib/tier";
import { useNetworkNotices } from "@/hooks/useNetwork";
import { useMode } from "@/hooks/useReducedMotion";
import { useExperience, type SceneId } from "@/store/experience";
import Cursor from "./chrome/Cursor";
import Grain from "./chrome/Grain";
import InstagramLink from "./chrome/InstagramLink";
import SceneIndex from "./chrome/SceneIndex";
import ScrollCue from "./chrome/ScrollCue";
import SkipLink from "./chrome/SkipLink";
import TalkLink from "./chrome/TalkLink";
import Wordmark from "./chrome/Wordmark";
import Loader from "./loader/Loader";
import Scene01Identity from "./scenes/s01-identity/Scene01Identity";
import Scene02Toolkit from "./scenes/s02-toolkit/Scene02Toolkit";
import Scene03Create from "./scenes/s03-create/Scene03Create";
import Scene04Projects from "./scenes/s04-projects/Scene04Projects";
import Scene05Philosophy from "./scenes/s05-philosophy/Scene05Philosophy";
import Scene06Final from "./scenes/s06-final/Scene06Final";
import RedCut from "./transitions/RedCut";
import Toast from "./ui/Toast";

// The 3D layer is its own chunk, fetched while the loader runs (Rules.md §5.3).
const Stage = dynamic(() => import("./three/Stage"), { ssr: false });

/** Scene order. Projects only exist while there is something to show (DECISIONS D-012). */
const SCENES: SceneId[] = [
  "identity",
  "toolkit",
  "create",
  ...(publishedProjects.length ? (["projects"] as SceneId[]) : []),
  "philosophy",
  "final",
];

/**
 * Orchestrates the whole experience: picks the mode, detects the quality tier, mounts the
 * loader, chrome, the persistent 3D stage and the scenes, and starts the scroll director.
 */
export default function Experience() {
  const mode = useMode();
  const tier = useExperience((s) => s.tier);
  const webglLost = useExperience((s) => s.webglLost);
  useNetworkNotices();

  // Layout effect: runs before any child's passive effect, so the loader's manifest
  // already sees the detected tier.
  useLayoutEffect(() => {
    if (!mode) return;
    const store = useExperience.getState();
    store.setScenes(SCENES);
    if (mode === "cine") {
      store.setTier(detectTier());
    } else {
      store.setTier("none");
      store.setLoaderState("done");
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "cine") return startDirector();
  }, [mode]);

  // Static mode: soft 400 ms fades as sections arrive (Design.md §11). Checked against the
  // scroll position (not IntersectionObserver), so fast scrolls and jumps never skip one.
  useEffect(() => {
    if (mode !== "static") return;
    let raf = 0;
    const check = () => {
      raf = 0;
      const limit = window.innerHeight * 0.92;
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)").forEach((el) => {
        if (el.getBoundingClientRect().top < limit) el.classList.add("is-in");
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [mode]);

  // Tab hidden → pause smooth scroll and CSS loops; the canvas pauses itself.
  useEffect(() => {
    const onVis = () => {
      const hidden = document.visibilityState === "hidden";
      document.documentElement.classList.toggle("is-hidden", hidden);
      setPaused(hidden);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const three = mode === "cine" && tierSettings[tier].three && !webglLost;

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        id="svh-probe"
        aria-hidden="true"
        className="pointer-events-none invisible fixed left-0 top-0 h-[100svh] w-0"
      />
      <SkipLink />
      <Loader />
      <Wordmark />
      <TalkLink />
      <SceneIndex />
      <InstagramLink />
      <ScrollCue />
      <div id="scroll-track" aria-hidden="true" className="cine-only" />
      <main id="main" className="stage-root">
        <div
          id="stage-canvas"
          aria-hidden="true"
          className="cine-only absolute inset-0"
          style={{ zIndex: "var(--z-canvas)" }}
        >
          {three ? <Stage /> : null}
          <div className="stage-vignette pointer-events-none absolute inset-0" />
        </div>
        <RedCut />
        <Scene01Identity />
        <Scene02Toolkit />
        <Scene03Create />
        {SCENES.includes("projects") ? <Scene04Projects /> : null}
        <Scene05Philosophy />
        <Scene06Final />
      </main>
      <Grain />
      <Cursor />
      <Toast />
    </LazyMotion>
  );
}
