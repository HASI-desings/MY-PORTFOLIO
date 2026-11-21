"use client";

import { useEffect, useRef, useState } from "react";
import { loadGsap } from "@/lib/gsap";
import { isCinematic } from "@/lib/a11y";
import { useSceneTimeline } from "@/hooks/useScene";
import { useThreeEnabled } from "@/hooks/useTier";
import { cn } from "@/lib/utils";
import { useExperience } from "@/store/experience";
import SceneShell from "../SceneShell";
import LettersFallback from "./LettersFallback";
import NameBlock from "./NameBlock";

/**
 * SCENE 01 — THE IDENTITY (Design.md §9). A dark room; HASI stands in it as architecture,
 * a red diagonal slices behind it, then quietly the name, roles and statement. No person.
 *
 * - Arrival (time-based, right after the loader hands off): the red plane slides in, the
 *   name block mask-rises line by line. Played once, so the first frame is complete.
 * - Scroll 35–100 %: the camera dollies left and tilts up (3D) while the name block
 *   parallaxes up and away; the lite letters emulate the same move. Ends in THE RED CUT.
 */
export default function Scene01Identity() {
  const three = useThreeEnabled();
  const loaderState = useExperience((s) => s.loaderState);
  const lettersReady = useExperience((s) => s.lettersReady);
  const nameRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const planeWrapRef = useRef<HTMLDivElement>(null);
  const introPlayed = useRef(false);
  // 3D was on when the arrival played, then the tier dropped (FPS guard / context loss):
  // the DOM plane appears already in place instead of waiting for an arrival that is over.
  const [lateLite, setLateLite] = useState(false);
  const [prevThree, setPrevThree] = useState(three);
  if (prevThree !== three) {
    setPrevThree(three);
    if (!three && loaderState === "done") setLateLite(true);
  }
  const threeRef = useRef(three);
  useEffect(() => {
    threeRef.current = three;
  }, [three]);

  // Arrival, once.
  useEffect(() => {
    if (loaderState !== "done" || introPlayed.current || !isCinematic()) return;
    introPlayed.current = true;
    let ctx: gsap.Context | null = null;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        if (planeRef.current) {
          gsap.fromTo(
            planeRef.current,
            { "--reveal": 0 },
            { "--reveal": 1, duration: 1.1, ease: "expo.out", delay: 0.15 },
          );
        }
        const lines = nameRef.current?.querySelectorAll(".mask-line__inner");
        if (lines?.length) {
          gsap.fromTo(
            lines,
            { y: 0, yPercent: 110 },
            { y: 0, yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.12, delay: 0.25 },
          );
        }
      });
    });
    return () => {
      cancelled = true;
      introPlayed.current = false; // dev double-run: let the second run play it
      ctx?.kill();
    };
  }, [loaderState]);

  useSceneTimeline("identity", (tl, ctx) => {
    if (nameRef.current) {
      tl.fromTo(
        nameRef.current,
        { y: 0 },
        { y: -0.32 * ctx.vh, ease: "none", duration: 0.65 },
        0.35,
      );
      tl.fromTo(
        nameRef.current,
        { autoAlpha: 1 },
        { autoAlpha: 0, ease: "power1.in", duration: 0.25 },
        0.72,
      );
    }
    // Lite letters follow the same camera move the 3D letters get. (With 3D on, the DOM
    // letters stay put: they are the measurement the 3D letters are placed from.)
    if (lettersRef.current && !threeRef.current) {
      tl.fromTo(
        lettersRef.current,
        { x: 0, y: 0, scale: 1 },
        { x: 0.03 * ctx.vw, y: 0.06 * ctx.vh, scale: 1.05, ease: "power2.inOut", duration: 0.65 },
        0.35,
      );
    }
    if (planeWrapRef.current) {
      tl.fromTo(
        planeWrapRef.current,
        { x: 0, y: 0 },
        { x: 0.02 * ctx.vw, y: 0.05 * ctx.vh, ease: "power2.inOut", duration: 0.65 },
        0.35,
      );
    }
  });

  return (
    <SceneShell id="identity" label="Identity">
      {!three ? (
        // The wrapper takes the scroll move; the plane keeps its own diagonal transform.
        <div ref={planeWrapRef} aria-hidden="true" className="absolute inset-0">
          <div ref={planeRef} className={cn("identity-plane", lateLite && "is-revealed")} />
        </div>
      ) : null}
      <LettersFallback
        ref={lettersRef}
        flatHidden={three && lettersReady}
        depthVisible={!three && loaderState === "done"}
      />
      <NameBlock ref={nameRef} />
    </SceneShell>
  );
}
