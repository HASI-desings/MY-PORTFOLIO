"use client";

import { at, len, type VisualBuild, type VisualProps } from "./types";

const SWATCHES = [
  { name: "OBSIDIAN", hex: "#111217", fill: "var(--obsidian)" },
  { name: "ICE GREY", hex: "#DFE5EB", fill: "var(--ice)" },
  { name: "RACING RED", hex: "#EF233C", fill: "var(--red)" },
];

/** The same layout twice: as wireframe strokes and as the finished, filled interface. */
function Screen({ mode }: { mode: "wire" | "final" }) {
  const wire = mode === "wire";
  const stroke = wire ? "var(--ice-30)" : "none";
  const f = (c: string) => (wire ? "none" : c);
  return (
    <g className={wire ? "vd-wire" : "vd-final"} fill="none" stroke={stroke} strokeWidth="1">
      <rect
        className="vd-el"
        x="20"
        y="24"
        width="300"
        height="330"
        fill={f("var(--obsidian-800)")}
        pathLength={1}
        strokeDasharray={wire ? "1" : undefined}
      />
      <rect
        className="vd-el"
        x="20"
        y="24"
        width="300"
        height="34"
        fill={f("var(--obsidian-700)")}
        pathLength={1}
        strokeDasharray={wire ? "1" : undefined}
      />
      <circle
        className="vd-el"
        cx="46"
        cy="41"
        r="8"
        fill={f("var(--red)")}
        pathLength={1}
        strokeDasharray={wire ? "1" : undefined}
      />
      <rect
        className="vd-el"
        x="40"
        y="84"
        width="180"
        height="16"
        fill={f("var(--ice)")}
        pathLength={1}
        strokeDasharray={wire ? "1" : undefined}
      />
      <rect
        className="vd-el"
        x="40"
        y="108"
        width="130"
        height="16"
        fill={f("var(--ice)")}
        pathLength={1}
        strokeDasharray={wire ? "1" : undefined}
      />
      <rect
        className="vd-el"
        x="40"
        y="136"
        width="210"
        height="6"
        fill={f("var(--ice-30)")}
        pathLength={1}
        strokeDasharray={wire ? "1" : undefined}
      />
      <rect
        className="vd-el"
        x="40"
        y="148"
        width="170"
        height="6"
        fill={f("var(--ice-30)")}
        pathLength={1}
        strokeDasharray={wire ? "1" : undefined}
      />
      <rect
        className="vd-el"
        x="40"
        y="172"
        width="260"
        height="110"
        fill={f("var(--graphite)")}
        pathLength={1}
        strokeDasharray={wire ? "1" : undefined}
      />
      <rect
        className="vd-el"
        x="40"
        y="300"
        width="96"
        height="30"
        rx="2"
        fill={f("var(--red)")}
        pathLength={1}
        strokeDasharray={wire ? "1" : undefined}
      />
      <rect
        className="vd-el"
        x="146"
        y="300"
        width="96"
        height="30"
        stroke={wire ? stroke : "var(--ice-30)"}
        pathLength={1}
        strokeDasharray={wire ? "1" : undefined}
      />
    </g>
  );
}

/**
 * 06 · UI/UX & Product Design — a wireframe screen morphs into a finished UI (strokes →
 * fills), then a type specimen and the HASI palette appear beside it.
 */
export default function VisualDesign(props: VisualProps) {
  void props;
  return (
    <svg viewBox="0 0 600 380" aria-hidden="true" className="vd absolute inset-0 h-full w-full">
      <Screen mode="final" />
      <Screen mode="wire" />
      <g transform="translate(360 40)">
        <g className="vd-type">
          <text
            y="96"
            fontSize="118"
            fill="var(--ice)"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontStretch: "125%",
              letterSpacing: "-0.04em",
            }}
          >
            Aa
          </text>
          <text y="128" fontSize="11" fill="var(--ice-60)" className="t-mono">
            ARCHIVO 900 · 125
          </text>
          <text y="148" fontSize="11" fill="var(--ice-30)" className="t-mono">
            GEIST · GEIST MONO
          </text>
        </g>
      </g>
      <g transform="translate(360 224)">
        {SWATCHES.map((s, i) => (
          <g key={s.name} className="vd-swatch" transform={`translate(${i * 76} 0)`}>
            <rect width="64" height="64" fill={s.fill} stroke="var(--ice-30)" />
            <text y="82" fontSize="9" fill="var(--ice-60)" className="t-mono">
              {s.name}
            </text>
            <text y="96" fontSize="9" fill="var(--ice-30)" className="t-mono">
              {s.hex}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export const buildDesign: VisualBuild = (root, tl, w) => {
  const wire = root.querySelectorAll(".vd-wire .vd-el");
  const finalEls = root.querySelectorAll(".vd-final .vd-el");
  const wireGroup = root.querySelector(".vd-wire");
  const type = root.querySelector(".vd-type");
  const swatches = root.querySelectorAll(".vd-swatch rect");
  if (wire.length)
    tl.fromTo(
      wire,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, ease: "power2.inOut", duration: len(w, 0.2), stagger: len(w, 0.012) },
      at(w, 0.05),
    );
  if (finalEls.length) {
    tl.fromTo(
      finalEls,
      { autoAlpha: 0, scale: 0.97, transformOrigin: "50% 50%" },
      { autoAlpha: 1, scale: 1, ease: "expo.out", duration: len(w, 0.14), stagger: len(w, 0.015) },
      at(w, 0.3),
    );
  }
  if (wireGroup)
    tl.fromTo(
      wireGroup,
      { autoAlpha: 1 },
      { autoAlpha: 0.2, ease: "none", duration: len(w, 0.16) },
      at(w, 0.34),
    );
  if (type)
    tl.fromTo(
      type,
      { autoAlpha: 0, x: 24 },
      { autoAlpha: 1, x: 0, ease: "expo.out", duration: len(w, 0.14) },
      at(w, 0.46),
    );
  if (swatches.length) {
    tl.fromTo(
      swatches,
      { scaleY: 0, transformOrigin: "50% 100%" },
      { scaleY: 1, ease: "expo.out", duration: len(w, 0.12), stagger: len(w, 0.04) },
      at(w, 0.55),
    );
  }
};
