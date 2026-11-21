"use client";

import { useEffect, useRef } from "react";
import { seeded } from "@/lib/utils";
import { at, len, type VisualBuild, type VisualProps } from "./types";

const W = 600;
const H = 360;
const PAD = { l: 16, r: 56, t: 20, b: 28 };
const N = 46;

/** Deterministic sample series: a slide, a base, then a turn — so a crossover happens. */
function makeSeries() {
  const rand = seeded(1729);
  const candles: { o: number; h: number; l: number; c: number }[] = [];
  let price = 100;
  for (let i = 0; i < N; i++) {
    const drift = i < 18 ? -0.7 : i < 24 ? 0 : 0.95;
    const o = price;
    const c = o + drift + (rand() - 0.5) * 3.2;
    const h = Math.max(o, c) + rand() * 1.6;
    const l = Math.min(o, c) - rand() * 1.6;
    candles.push({ o, h, l, c });
    price = c;
  }
  const ema = (period: number) => {
    const k = 2 / (period + 1);
    const out: number[] = [];
    candles.forEach((d, i) => out.push(i === 0 ? d.c : d.c * k + out[i - 1] * (1 - k)));
    return out;
  };
  const fast = ema(8);
  const slow = ema(21);
  let cross = N - 6;
  for (let i = 22; i < N; i++) {
    if (fast[i - 1] <= slow[i - 1] && fast[i] > slow[i]) {
      cross = i;
      break;
    }
  }
  const lo = Math.min(...candles.map((d) => d.l)) - 2;
  const hi = Math.max(...candles.map((d) => d.h)) + 2;
  return { candles, fast, slow, cross, lo, hi };
}

const S = makeSeries();
const step = (W - PAD.l - PAD.r) / N;
const xAt = (i: number) => PAD.l + step * (i + 0.5);
const yAt = (v: number) => PAD.t + ((S.hi - v) / (S.hi - S.lo)) * (H - PAD.t - PAD.b);
const line = (vals: number[]) =>
  vals.map((v, i) => `${i ? "L" : "M"}${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`).join(" ");

/**
 * 05 · Trading & Financial Technology — a candlestick chart draws left → right with a fast
 * and slow EMA; a red signal marker appears at the crossover. The pointer's x shows a
 * crosshair with the price. Sample data, not a real instrument.
 */
export default function VisualTrading({ lite }: VisualProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || lite) return;
    const v = svg.querySelector<SVGLineElement>(".vt-x");
    const hLine = svg.querySelector<SVGLineElement>(".vt-y");
    const tag = svg.querySelector<SVGGElement>(".vt-tag");
    const text = svg.querySelector<SVGTextElement>(".vt-tag text");
    const group = svg.querySelector<SVGGElement>(".vt-cross");
    const onMove = (e: PointerEvent) => {
      const m = svg.getScreenCTM();
      if (!m || !v || !hLine || !tag || !text || !group) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      const i = Math.max(0, Math.min(N - 1, Math.round((p.x - PAD.l) / step - 0.5)));
      const x = xAt(i);
      const y = Math.max(PAD.t, Math.min(H - PAD.b, p.y));
      const price = S.hi - ((y - PAD.t) / (H - PAD.t - PAD.b)) * (S.hi - S.lo);
      v.setAttribute("x1", String(x));
      v.setAttribute("x2", String(x));
      hLine.setAttribute("y1", String(y));
      hLine.setAttribute("y2", String(y));
      tag.setAttribute("transform", `translate(${W - PAD.r + 4} ${y})`);
      text.textContent = price.toFixed(2);
      group.setAttribute("opacity", "1");
    };
    const onLeave = () => group?.setAttribute("opacity", "0");
    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerleave", onLeave);
    return () => {
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerleave", onLeave);
    };
  }, [lite]);

  const cx = xAt(S.cross);
  const cy = yAt(S.candles[S.cross].l) + 16;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="vt absolute inset-0 h-full w-full"
    >
      <defs>
        <clipPath id="vt-reveal">
          <rect className="vt-reveal" x="0" y="0" width={W} height={H} />
        </clipPath>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={PAD.l}
          x2={W - PAD.r}
          y1={PAD.t + f * (H - PAD.t - PAD.b)}
          y2={PAD.t + f * (H - PAD.t - PAD.b)}
          stroke="var(--ice-10)"
        />
      ))}
      <g clipPath="url(#vt-reveal)">
        {S.candles.map((d, i) => {
          const up = d.c >= d.o;
          const x = xAt(i);
          return (
            <g key={i}>
              <line
                x1={x}
                x2={x}
                y1={yAt(d.h)}
                y2={yAt(d.l)}
                stroke={up ? "var(--ice)" : "var(--ice-30)"}
              />
              <rect
                x={x - step * 0.32}
                width={step * 0.64}
                y={yAt(Math.max(d.o, d.c))}
                height={Math.max(1, Math.abs(yAt(d.o) - yAt(d.c)))}
                fill={up ? "var(--ice)" : "var(--obsidian)"}
                stroke={up ? "var(--ice)" : "var(--ice-30)"}
              />
            </g>
          );
        })}
      </g>
      <path
        className="vt-slow"
        d={line(S.slow)}
        fill="none"
        stroke="var(--ice-30)"
        strokeWidth="1.2"
        pathLength={1}
        strokeDasharray="1"
      />
      <path
        className="vt-fast"
        d={line(S.fast)}
        fill="none"
        stroke="var(--ice)"
        strokeWidth="1.5"
        pathLength={1}
        strokeDasharray="1"
      />
      <g transform={`translate(${cx} ${cy})`}>
        <g className="vt-signal">
          <path d="M0 -7 L7 5 L-7 5 Z" fill="var(--red)" />
          <text y="22" textAnchor="middle" fontSize="10" fill="var(--red)" className="t-mono">
            SIGNAL
          </text>
        </g>
      </g>
      <text x={PAD.l} y={H - 6} fontSize="10" fill="var(--ice-30)" className="t-mono">
        EMA 8 / 21 · SAMPLE
      </text>
      <g className="vt-cross" opacity="0">
        <line
          className="vt-x"
          y1={PAD.t}
          y2={H - PAD.b}
          stroke="var(--ice-30)"
          strokeDasharray="3 3"
        />
        <line
          className="vt-y"
          x1={PAD.l}
          x2={W - PAD.r}
          stroke="var(--ice-30)"
          strokeDasharray="3 3"
        />
        <g className="vt-tag">
          <rect x="0" y="-9" width="50" height="18" fill="var(--obsidian-700)" />
          <text
            x="25"
            y="4"
            textAnchor="middle"
            fontSize="10"
            fill="var(--ice)"
            className="t-mono"
          />
        </g>
      </g>
    </svg>
  );
}

export const buildTrading: VisualBuild = (root, tl, w) => {
  const reveal = root.querySelector(".vt-reveal");
  const fast = root.querySelector(".vt-fast");
  const slow = root.querySelector(".vt-slow");
  const signal = root.querySelector(".vt-signal");
  const draw = len(w, 0.55);
  if (reveal)
    tl.fromTo(
      reveal,
      { attr: { width: 0 } },
      { attr: { width: W }, ease: "none", duration: draw },
      at(w, 0.1),
    );
  if (slow)
    tl.fromTo(
      slow,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, ease: "none", duration: draw },
      at(w, 0.1),
    );
  if (fast)
    tl.fromTo(
      fast,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, ease: "none", duration: draw },
      at(w, 0.1),
    );
  if (signal) {
    const when = at(w, 0.1) + draw * (xAt(S.cross) / W);
    tl.fromTo(
      signal,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, ease: "expo.out", duration: len(w, 0.08) },
      when,
    );
  }
};
