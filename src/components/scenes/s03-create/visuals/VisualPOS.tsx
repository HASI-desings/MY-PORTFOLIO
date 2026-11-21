"use client";

import { at, len, type VisualBuild, type VisualProps } from "./types";

// Illustrative receipt — clearly marked SAMPLE (Rules.md §1.5).
const LINES: [string, string][] = [
  ["ITEM 01   2 ×", "450"],
  ["ITEM 02   1 ×", "1,200"],
  ["ITEM 03   3 ×", "180"],
];
const BARS = [72, 54, 88, 40, 64]; // stock before the sale (%)
const AFTER = [64, 50, 76, 40, 58]; // after — the sold items drop
const BARCODE = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3];

/**
 * 04 · POS & Business Management — a receipt prints line by line from a slot, a red scan
 * line sweeps the barcode, the inventory bars update.
 */
export default function VisualPOS(props: VisualProps) {
  void props;
  return (
    <div
      aria-hidden="true"
      className="vp absolute inset-0 flex items-center justify-center gap-[6%]"
    >
      <div className="relative flex w-[44%] max-w-[260px] flex-col items-center">
        <span className="relative z-10 h-3 w-full border border-obsidian-700 bg-obsidian-800" />
        <div className="vp-receipt relative -mt-1 w-[86%] bg-ice px-[7%] pb-[9%] pt-[8%] text-obsidian [clip-path:polygon(0_0,100%_0,100%_100%,92%_98%,84%_100%,76%_98%,68%_100%,60%_98%,52%_100%,44%_98%,36%_100%,28%_98%,20%_100%,12%_98%,4%_100%,0_98%)]">
          <p className="vp-line t-mono flex justify-between text-[10px] font-medium">
            <span>HASI · POS</span>
            <span>SAMPLE</span>
          </p>
          <p className="vp-line my-2 border-t border-dashed border-obsidian/40" />
          {LINES.map(([a, b]) => (
            <p key={a} className="vp-line t-mono flex justify-between text-[10px]">
              <span>{a}</span>
              <span>{b}</span>
            </p>
          ))}
          <p className="vp-line my-2 border-t border-dashed border-obsidian/40" />
          <p className="vp-line t-mono flex justify-between text-[11px] font-medium">
            <span>TOTAL</span>
            <span>2,190</span>
          </p>
          <div className="vp-line vp-barcode relative mt-3 flex h-9 items-stretch gap-[2px] overflow-hidden">
            {BARCODE.map((w, i) => (
              <span key={i} className="bg-obsidian" style={{ width: w * 1.6 }} />
            ))}
            <span className="vp-scan absolute inset-y-0 left-0 w-[2px] bg-red" />
          </div>
        </div>
      </div>

      <div className="flex w-[40%] max-w-[260px] flex-col gap-3">
        <span className="t-mono text-[10px] text-ice-60">INVENTORY</span>
        <div className="flex h-[min(34svh,240px)] items-end gap-[8%] border-b border-ice-30">
          {BARS.map((h, i) => (
            <span key={i} className="relative flex h-full flex-1 items-end">
              <span
                className={`vp-bar block w-full origin-bottom ${i === 2 ? "bg-red" : "bg-ice-30"}`}
                style={{ height: `${AFTER[i]}%` }}
                data-before={h / AFTER[i]}
              />
            </span>
          ))}
        </div>
        <div className="flex justify-between">
          {BARS.map((_, i) => (
            <span key={i} className="t-mono flex-1 text-center text-[9px] text-ice-30">
              0{i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export const buildPOS: VisualBuild = (root, tl, w) => {
  const receipt = root.querySelector(".vp-receipt");
  const lines = root.querySelectorAll(".vp-line");
  const scan = root.querySelector(".vp-scan");
  const barcode = root.querySelector<HTMLElement>(".vp-barcode");
  if (receipt) {
    tl.fromTo(
      receipt,
      { yPercent: -55, clipPath: "inset(0% 0% 100% 0%)" },
      { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", duration: len(w, 0.34) },
      at(w, 0.08),
    );
  }
  if (lines.length)
    tl.fromTo(
      lines,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: len(w, 0.03), stagger: len(w, 0.035) },
      at(w, 0.12),
    );
  if (scan && barcode) {
    tl.fromTo(
      scan,
      { x: 0, autoAlpha: 1 },
      { x: () => barcode.clientWidth - 2, ease: "power1.inOut", duration: len(w, 0.14) },
      at(w, 0.5),
    );
    tl.to(scan, { autoAlpha: 0, duration: len(w, 0.03) }, at(w, 0.64));
  }
  root.querySelectorAll<HTMLElement>(".vp-bar").forEach((bar, i) => {
    const before = Number(bar.dataset.before) || 1;
    tl.fromTo(
      bar,
      { scaleY: 0 },
      { scaleY: before, ease: "expo.out", duration: len(w, 0.14) },
      at(w, 0.16 + i * 0.03),
    );
    tl.to(bar, { scaleY: 1, ease: "power2.inOut", duration: len(w, 0.1) }, at(w, 0.62 + i * 0.015));
  });
};
