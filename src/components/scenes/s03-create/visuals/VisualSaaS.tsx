"use client";

import { at, len, type VisualBuild, type VisualProps } from "./types";

// Neutral, obviously decorative figures (Rules.md §1.5) — labelled SAMPLE DATA on screen.
const KPIS = [
  { label: "INDEX", value: 0.84, digits: 2 },
  { label: "RATE / H", value: 12.6, digits: 1 },
  { label: "QUEUE", value: 318, digits: 0 },
];

const CHART = "M0 74 L24 66 L48 70 L72 52 L96 58 L120 40 L144 46 L168 30 L192 36 L216 20 L240 26";

/**
 * 03 · Custom Software & SaaS — dashboard modules (sidebar, KPIs, chart, table) slide in and
 * snap into a grid like magnets; the numbers tick up. All values are decorative.
 */
export default function VisualSaaS(props: VisualProps) {
  void props;
  return (
    <div aria-hidden="true" className="vs absolute inset-0 flex items-center justify-center">
      <div className="relative grid aspect-[16/10] w-full max-w-[640px] grid-cols-[18%_1fr_1fr_1fr] grid-rows-[auto_1fr_auto] gap-[2.2%]">
        <div className="vs-mod row-span-3 flex flex-col gap-[10%] border border-obsidian-700 bg-obsidian-800 p-[12%]">
          <span className="h-2 w-[70%] bg-ice" />
          <span className="h-1.5 w-[80%] bg-ice-30" />
          <span className="h-1.5 w-[60%] bg-red" />
          <span className="h-1.5 w-[75%] bg-ice-30" />
          <span className="h-1.5 w-[55%] bg-ice-30" />
        </div>
        {KPIS.map((k) => (
          <div
            key={k.label}
            className="vs-mod flex flex-col gap-2 border border-obsidian-700 bg-obsidian-800 p-[9%]"
          >
            <span className="t-mono text-[10px] text-ice-60">{k.label}</span>
            <span
              className="vs-num font-display text-[clamp(1.1rem,2.4vw,2rem)] font-extrabold leading-none text-ice [font-stretch:110%]"
              data-value={k.value}
              data-digits={k.digits}
            >
              {k.value.toFixed(k.digits)}
            </span>
          </div>
        ))}
        <div className="vs-mod col-span-2 border border-obsidian-700 bg-obsidian-800 p-[4%]">
          <svg viewBox="0 0 240 90" className="h-full w-full" preserveAspectRatio="none">
            <path d={`${CHART} L240 90 L0 90 Z`} fill="var(--ice-10)" />
            <path
              className="vs-line"
              d={CHART}
              fill="none"
              stroke="var(--ice)"
              strokeWidth="1.5"
              pathLength={1}
              strokeDasharray="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx="216" cy="20" r="3" fill="var(--red)" />
          </svg>
        </div>
        <div className="vs-mod flex flex-col justify-between border border-obsidian-700 bg-obsidian-800 p-[9%]">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="flex items-center justify-between gap-2 border-b border-obsidian-700 pb-1 last:border-0"
            >
              <span className="h-1.5 w-[45%] bg-ice-30" />
              <span className={`h-1.5 w-[22%] ${i === 1 ? "bg-red" : "bg-ice-10"}`} />
            </span>
          ))}
        </div>
        <span className="t-mono absolute -bottom-7 right-0 text-[10px] text-ice-30">
          SAMPLE DATA
        </span>
      </div>
    </div>
  );
}

export const buildSaaS: VisualBuild = (root, tl, w) => {
  const mods = Array.from(root.querySelectorAll<HTMLElement>(".vs-mod"));
  const offsets = [
    [-90, 40, -5],
    [60, -110, 4],
    [140, -60, -3],
    [180, 30, 5],
    [-60, 120, 3],
    [120, 110, -4],
  ];
  mods.forEach((m, i) => {
    const [x, y, r] = offsets[i % offsets.length];
    tl.fromTo(
      m,
      { x, y, rotate: r, autoAlpha: 0 },
      { x: 0, y: 0, rotate: 0, autoAlpha: 1, ease: "expo.out", duration: len(w, 0.16) },
      at(w, 0.08 + i * 0.045),
    );
  });
  const line = root.querySelector(".vs-line");
  if (line)
    tl.fromTo(
      line,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, ease: "power2.inOut", duration: len(w, 0.22) },
      at(w, 0.36),
    );
  root.querySelectorAll<HTMLElement>(".vs-num").forEach((el, i) => {
    const value = Number(el.dataset.value);
    const digits = Number(el.dataset.digits);
    const proxy = { v: 0 };
    tl.fromTo(
      proxy,
      { v: 0 },
      {
        v: value,
        ease: "power2.out",
        duration: len(w, 0.25),
        onUpdate: () => {
          el.textContent = proxy.v.toFixed(digits);
        },
      },
      at(w, 0.3 + i * 0.04),
    );
  });
};
