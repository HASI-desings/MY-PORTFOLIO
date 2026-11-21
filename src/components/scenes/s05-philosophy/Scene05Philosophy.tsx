"use client";

import { useEffect, useRef } from "react";
import MaskText from "@/components/ui/MaskText";
import MonoLabel from "@/components/ui/MonoLabel";
import { philosophy } from "@/content/philosophy";
import { usePointer, pointer } from "@/hooks/usePointer";
import { useIsActive, useSceneTimeline } from "@/hooks/useScene";
import { useFinePointer } from "@/hooks/useReducedMotion";
import { useExperience } from "@/store/experience";
import SceneShell from "../SceneShell";
import LightBeam from "./LightBeam";

/**
 * SCENE 05 — THE PHILOSOPHY (Design.md §9). Pure typography and light.
 * 0–40 % the words build one by one while the beam follows the newest word · 40–55 % the
 * whole line is lit and NOT A TRAIT. gets its red underline · 55–90 % the line recedes and
 * three supporting lines arrive one at a time · 90–100 % hold, then THE RED CUT.
 */
export default function Scene05Philosophy() {
  const blockRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLOListElement>(null);
  const index = useExperience((s) => s.scenes.indexOf("philosophy"));
  const active = useIsActive("philosophy");
  const fine = useFinePointer();
  usePointer();

  // Desktop: the pointer's horizontal position nudges the beam ±8 %.
  useEffect(() => {
    const block = blockRef.current;
    if (!block || !active || !fine) return;
    let raf = 0;
    let nudge = 0;
    const loop = () => {
      nudge += ((pointer.active ? pointer.x : 0) * 8 - nudge) * 0.08;
      block.style.setProperty("--nudge", `${nudge.toFixed(2)}%`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, fine]);

  useSceneTimeline("philosophy", (tl) => {
    const block = blockRef.current;
    if (!block) return;
    const lit = block.querySelector<HTMLElement>(".philo-lit");
    const dimWords = Array.from(block.querySelectorAll<HTMLElement>(".philo-dim [data-word]"));
    const litWords = Array.from(block.querySelectorAll<HTMLElement>(".philo-lit [data-word]"));
    const width = block.offsetWidth || 1;

    // 0–40 %: words build, the beam travels to each new word.
    const per = 0.4 / dimWords.length;
    tl.set(block, { "--beam": "-20%", "--lit": 0 }, 0);
    dimWords.forEach((word, i) => {
      const letters = [
        ...word.querySelectorAll(".letter"),
        ...(litWords[i]?.querySelectorAll(".letter") ?? []),
      ];
      tl.fromTo(
        letters,
        { autoAlpha: 0, yPercent: 40, rotateX: -60 },
        {
          autoAlpha: 1,
          yPercent: 0,
          rotateX: 0,
          ease: "expo.out",
          duration: per * 1.6,
          stagger: per * 0.08,
        },
        i * per,
      );
      const center = ((word.offsetLeft + word.offsetWidth / 2) / width) * 100;
      tl.to(block, { "--beam": `${center}%`, ease: "power2.inOut", duration: per }, i * per);
    });

    // 40–55 %: fully lit; red underline draws under NOT A TRAIT.
    tl.to(block, { "--lit": 1, ease: "power1.inOut", duration: 0.1 }, 0.4);
    const underline = block.querySelector(".philo-underline");
    if (underline)
      tl.fromTo(
        underline,
        { scaleX: 0 },
        { scaleX: 1, ease: "power2.inOut", duration: 0.12 },
        0.43,
      );

    // 55–90 %: recede; supporting lines one at a time.
    tl.to(
      block,
      { scale: 0.92, transformOrigin: "0% 0%", ease: "power2.inOut", duration: 0.2 },
      0.55,
    );
    if (lit) tl.to(lit, { autoAlpha: 0.3, ease: "power1.inOut", duration: 0.2 }, 0.55);
    const items = supportRef.current?.querySelectorAll("li");
    items?.forEach((li, i) => {
      const inner = li.querySelectorAll(".mask-line__inner, .philo-idx");
      tl.fromTo(
        inner,
        { y: 0, yPercent: 110, autoAlpha: 0 },
        { y: 0, yPercent: 0, autoAlpha: 1, ease: "expo.out", duration: 0.1, stagger: 0.01 },
        0.6 + i * 0.09,
      );
    });
  });

  return (
    <SceneShell id="philosophy" label="Philosophy">
      <div
        className="absolute"
        style={{
          left: "var(--edge-x)",
          top: "calc(clamp(72px, 12svh, 120px) + var(--safe-top))",
          zIndex: "var(--z-scene-fg)",
        }}
      >
        <MonoLabel tone="dim" as="p">
          {String(index + 1).padStart(2, "0")} — {philosophy.label}
        </MonoLabel>
      </div>

      <div
        className="philo-stage absolute inset-x-0 px-[var(--edge-x)]"
        style={{ top: "clamp(120px, 21svh, 220px)" }}
      >
        <h2 className="sr-only">{philosophy.lines.join(" ")}</h2>
        <LightBeam ref={blockRef} />
      </div>

      <ol
        ref={supportRef}
        className="philo-support absolute left-[var(--edge-x)] flex flex-col gap-5 md:left-1/2"
        style={{
          right: "var(--edge-x-r)",
          bottom: "calc(clamp(72px, 11svh, 120px) + var(--safe-bottom))",
          zIndex: "var(--z-scene-fg)",
        }}
      >
        {philosophy.supporting.map((s) => (
          <li
            key={s.index}
            className="philo-sup reveal grid grid-cols-[2.5rem_1fr] items-baseline gap-2"
          >
            <span className="mask-line">
              <span className="philo-idx t-mono block text-red">{s.index}</span>
            </span>
            <MaskText
              lines={[s.text]}
              className="max-w-[46ch] text-[length:var(--fs-body-l)] leading-[1.4]"
            />
          </li>
        ))}
      </ol>
    </SceneShell>
  );
}
