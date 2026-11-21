"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import MaskText from "@/components/ui/MaskText";
import { final } from "@/content/final";
import { site } from "@/content/site";
import { getGsap } from "@/lib/gsap";
import { mailtoUrl, whatsappUrl } from "@/lib/contact";
import { useMode } from "@/hooks/useReducedMotion";
import { useIsActive, useSceneProgress, useSceneTimeline } from "@/hooks/useScene";
import SceneShell from "../SceneShell";
import ContactOptions from "./ContactOptions";
import CtaButton from "./CtaButton";
import Footer from "./Footer";
import Portrait from "./Portrait";

/** Two lines max per statement on every screen (Design.md §13). */
const STATEMENT_LINES: [string, string][] = [
  ["EVERY IDEA", "STARTS SOMEWHERE."],
  ["LET'S BUILD", "SOMETHING."],
];

/**
 * SCENE 06 — THE FINAL INTERACTION (Design.md §9, D-014). After five scenes in the dark the
 * RED CUT sweeps and the room lights up: the studio backdrop of his own photo, recreated at
 * any screen size. For the first time, the creator — rising, with a thin red rim. Behind him
 * the giant statements; over his torso the one red button.
 *
 * 0–25 % lights on, red diagonal slides in low · 20–45 % portrait rises (brightness 0.4 → 1)
 * · 45–65 % EVERY IDEA STARTS SOMEWHERE. · 65–80 % it lifts away, LET'S BUILD SOMETHING.
 * rises · 80 % the CTA rises once, crisply (time-based, not scrubbed) and stays.
 */
export default function Scene06Final() {
  const mode = useMode();
  const active = useIsActive("final");
  const darkRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const s1Ref = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);
  const ctaWrapRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const ctaShown = useRef(false);
  const [open, setOpen] = useState(false);

  const showCta = useCallback((instant: boolean) => {
    if (ctaShown.current || !ctaWrapRef.current) return;
    ctaShown.current = true;
    const { gsap } = getGsap();
    if (instant) gsap.set(ctaWrapRef.current, { autoAlpha: 1, y: 0 });
    else
      gsap.fromTo(
        ctaWrapRef.current,
        { autoAlpha: 1, y: () => window.innerHeight * 0.4 },
        { y: 0, duration: 0.9, ease: "expo.out" },
      );
  }, []);

  useSceneProgress("final", (p) => {
    if (p >= 0.8) showCta(false);
    // Chrome turns obsidian once the lights are up.
    const root = document.documentElement;
    const lit = mode === "cine" && active && p > 0.16;
    if (lit) root.dataset.chrome = "light";
    else if (root.dataset.chrome) delete root.dataset.chrome;
  });

  // Static / reduced motion: everything is simply there; the CTA appears without travel.
  useEffect(() => {
    if (mode === "static") showCta(true);
  }, [mode, showCta]);

  useEffect(() => {
    if (!active && document.documentElement.dataset.chrome)
      delete document.documentElement.dataset.chrome;
  }, [active]);

  useSceneTimeline("final", (tl) => {
    if (darkRef.current)
      tl.fromTo(
        darkRef.current,
        { autoAlpha: 1 },
        { autoAlpha: 0, ease: "power2.inOut", duration: 0.24 },
        0.03,
      );
    if (backdropRef.current)
      tl.fromTo(
        backdropRef.current,
        { scale: 1.08 },
        { scale: 1, ease: "power2.out", duration: 0.3 },
        0.03,
      );
    if (planeRef.current)
      tl.fromTo(
        planeRef.current,
        { "--reveal": 0 },
        { "--reveal": 1, ease: "expo.out", duration: 0.2 },
        0.04,
      );
    if (portraitRef.current) {
      tl.fromTo(
        portraitRef.current,
        { yPercent: 12, autoAlpha: 0, filter: "brightness(0.4)" },
        { yPercent: 0, autoAlpha: 1, filter: "brightness(1)", ease: "power3.out", duration: 0.25 },
        0.2,
      );
      const rim = portraitRef.current.querySelector(".final-rim");
      if (rim)
        tl.fromTo(rim, { opacity: 0 }, { opacity: 1, ease: "power1.inOut", duration: 0.15 }, 0.32);
    }
    const s1 = s1Ref.current?.querySelectorAll(".mask-line__inner");
    const s2 = s2Ref.current?.querySelectorAll(".mask-line__inner");
    if (s1?.length) {
      tl.fromTo(
        s1,
        { y: 0, yPercent: 110 },
        { y: 0, yPercent: 0, ease: "expo.out", duration: 0.14, stagger: 0.03 },
        0.45,
      );
      tl.to(s1, { yPercent: -110, ease: "power3.in", duration: 0.07, stagger: 0.015 }, 0.65);
    }
    if (s2?.length)
      tl.fromTo(
        s2,
        { y: 0, yPercent: 110 },
        { y: 0, yPercent: 0, ease: "expo.out", duration: 0.12, stagger: 0.03 },
        0.69,
      );
  });

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => ctaRef.current?.focus(), 60);
  }, []);

  return (
    <SceneShell id="final" label="Contact" className="final">
      <div ref={backdropRef} aria-hidden="true" className="final-backdrop absolute inset-0" />
      <div
        ref={darkRef}
        aria-hidden="true"
        className="final-dark cine-only absolute inset-0 bg-obsidian"
      />
      <div ref={planeRef} aria-hidden="true" className="final-plane" />

      <div className="final-statements absolute inset-x-0 px-[var(--edge-x)]" style={{ zIndex: 3 }}>
        <div ref={s1Ref} className="final-statement">
          <MaskText as="h2" lines={STATEMENT_LINES[0]} className="t-condensed text-center" />
        </div>
        <div ref={s2Ref} className="final-statement">
          <MaskText as="p" lines={STATEMENT_LINES[1]} className="t-condensed text-center" />
        </div>
      </div>

      <Portrait ref={portraitRef} />

      {/* Static / reduced motion: the second statement sits over the shirt, above the CTA. */}
      <p
        aria-hidden="true"
        className="static-only final-static-line t-condensed absolute inset-x-0 text-center text-ice"
      >
        {STATEMENT_LINES[1].join(" ")}
      </p>

      <div
        ref={ctaWrapRef}
        className="final-cta absolute inset-x-0 flex justify-center px-[var(--edge-x)]"
        style={{ zIndex: 5 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <ContactOptions key="options" onClose={close} />
          ) : (
            <CtaButton key="cta" ref={ctaRef} onActivate={() => setOpen(true)} />
          )}
        </AnimatePresence>
      </div>

      <noscript>
        <div className="final-noscript">
          <a href={mailtoUrl()}>
            {final.options.email}: {site.contact.email}
          </a>
          <a href={whatsappUrl()}>
            {final.options.whatsapp}: {site.contact.whatsappDisplay}
          </a>
        </div>
      </noscript>

      <Footer />
    </SceneShell>
  );
}
