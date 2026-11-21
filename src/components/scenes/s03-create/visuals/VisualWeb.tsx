"use client";

import { at, len, type VisualBuild, type VisualProps } from "./types";

/** A browser frame: chrome bar with three dots and an address pill, then a body. */
function Frame({ className, children }: { className: string; children?: React.ReactNode }) {
  return (
    <div className={`vw-frame absolute border border-obsidian-700 bg-obsidian-800 ${className}`}>
      <div className="flex h-[9%] min-h-[18px] items-center gap-[1.2%] border-b border-obsidian-700 px-[3%]">
        <span className="h-[5px] w-[5px] rounded-full bg-ice-30" />
        <span className="h-[5px] w-[5px] rounded-full bg-ice-30" />
        <span className="h-[5px] w-[5px] rounded-full bg-ice-30" />
        <span className="ml-[4%] h-[38%] w-[46%] rounded-[2px] bg-obsidian-700" />
      </div>
      <div className="relative h-[91%] overflow-hidden">{children}</div>
    </div>
  );
}

/**
 * 01 · Websites & Digital Experiences — three browser frames assemble in perspective;
 * inside the front one, wireframe blocks build a layout, a section scrolls, a cursor moves.
 */
export default function VisualWeb({ active, lite }: VisualProps) {
  return (
    <div aria-hidden="true" className="vw absolute inset-0 [perspective:1400px]">
      <div className="vw-stage absolute inset-0 [transform-style:preserve-3d]">
        <Frame className="vw-back left-[2%] top-[4%] h-[62%] w-[56%] opacity-60" />
        <Frame className="vw-mid left-[40%] top-[0%] h-[58%] w-[54%] opacity-80" />
        <Frame className="vw-front left-[14%] top-[26%] h-[70%] w-[72%]">
          <div className="vw-page absolute inset-x-0 top-0 flex flex-col gap-[4%] p-[5%]">
            <div className="vw-block flex items-center justify-between">
              <span className="h-[10px] w-[16%] bg-ice" />
              <span className="flex w-[34%] justify-between">
                <span className="h-[6px] w-[22%] bg-ice-30" />
                <span className="h-[6px] w-[22%] bg-ice-30" />
                <span className="h-[6px] w-[22%] bg-red" />
              </span>
            </div>
            <div className="vw-block mt-[3%] h-[18px] w-[62%] bg-ice" />
            <div className="vw-block h-[18px] w-[44%] bg-ice" />
            <div className="vw-block h-[6px] w-[52%] bg-ice-30" />
            <div className="vw-block mt-[2%] grid grid-cols-3 gap-[4%]">
              <span className="aspect-[4/3] border border-ice-30" />
              <span className="aspect-[4/3] border border-ice-30" />
              <span className="aspect-[4/3] border border-ice-30" />
            </div>
            <div className="vw-block h-[6px] w-[70%] bg-ice-10" />
            <div className="vw-block h-[6px] w-[58%] bg-ice-10" />
            <div className="vw-block grid grid-cols-2 gap-[4%]">
              <span className="aspect-[16/9] bg-obsidian-700" />
              <span className="aspect-[16/9] bg-obsidian-700" />
            </div>
          </div>
          <span
            className={`vw-cursor absolute h-2.5 w-2.5 rounded-full bg-ice ${active && !lite ? "is-on" : ""}`}
          />
        </Frame>
      </div>
    </div>
  );
}

export const buildWeb: VisualBuild = (root, tl, w) => {
  const back = root.querySelector(".vw-back");
  const mid = root.querySelector(".vw-mid");
  const front = root.querySelector(".vw-front");
  const blocks = root.querySelectorAll(".vw-block");
  const page = root.querySelector(".vw-page");
  if (back)
    tl.fromTo(
      back,
      { x: -120, z: -260, rotateY: 24, autoAlpha: 0 },
      { x: 0, z: 0, rotateY: 14, autoAlpha: 0.6, ease: "expo.out", duration: len(w, 0.3) },
      at(w, 0.02),
    );
  if (mid)
    tl.fromTo(
      mid,
      { x: 160, z: -320, rotateY: -26, autoAlpha: 0 },
      { x: 0, z: 0, rotateY: -12, autoAlpha: 0.8, ease: "expo.out", duration: len(w, 0.3) },
      at(w, 0.07),
    );
  if (front)
    tl.fromTo(
      front,
      { y: 120, z: -200, rotateX: 18, autoAlpha: 0 },
      { y: 0, z: 60, rotateX: 4, autoAlpha: 1, ease: "expo.out", duration: len(w, 0.3) },
      at(w, 0.12),
    );
  if (blocks.length) {
    tl.fromTo(
      blocks,
      { scaleX: 0, transformOrigin: "0% 50%", autoAlpha: 0 },
      { scaleX: 1, autoAlpha: 1, ease: "expo.out", duration: len(w, 0.12), stagger: len(w, 0.025) },
      at(w, 0.28),
    );
  }
  // A section scroll-animates within the frame.
  if (page)
    tl.fromTo(
      page,
      { yPercent: 0 },
      { yPercent: -22, ease: "power2.inOut", duration: len(w, 0.2) },
      at(w, 0.58),
    );
};
