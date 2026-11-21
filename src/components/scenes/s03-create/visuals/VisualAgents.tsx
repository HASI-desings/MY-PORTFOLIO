"use client";

import { useEffect, useRef } from "react";
import { at, len, type VisualBuild, type VisualProps } from "./types";

type NodeDef = { id: string; x: number; y: number; label: string; r: number };

// Illustrative workflow — labels describe steps, not claims (Rules.md §1.5).
const NODES: NodeDef[] = [
  { id: "in", x: 56, y: 200, label: "TRIGGER", r: 9 },
  { id: "agent", x: 232, y: 200, label: "AGENT", r: 17 },
  { id: "t1", x: 410, y: 72, label: "RESEARCH", r: 9 },
  { id: "t2", x: 452, y: 158, label: "DRAFT", r: 9 },
  { id: "t3", x: 448, y: 248, label: "REVIEW", r: 9 },
  { id: "t4", x: 404, y: 334, label: "ACT", r: 9 },
  { id: "out", x: 560, y: 205, label: "DONE", r: 11 },
];
const EDGES: [string, string][] = [
  ["in", "agent"],
  ["agent", "t1"],
  ["agent", "t2"],
  ["agent", "t3"],
  ["agent", "t4"],
  ["t1", "out"],
  ["t2", "out"],
  ["t3", "out"],
  ["t4", "out"],
];
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

function edgePath([a, b]: [string, string]) {
  const p = byId[a];
  const q = byId[b];
  const mx = (p.x + q.x) / 2;
  return `M${p.x} ${p.y} C${mx} ${p.y}, ${mx} ${q.y}, ${q.x} ${q.y}`;
}

/**
 * 02 · AI Automation & Agentic Systems — a node graph: nodes appear, edges draw, red pulses
 * travel node to node; the AGENT node branches into tasks. Bring the pointer near a node and
 * the pulses route toward it.
 */
export default function VisualAgents({ active, lite }: VisualProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !active || lite) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>(".va-edge"));
    const dots = Array.from(svg.querySelectorAll<SVGCircleElement>(".va-pulse"));
    const nodes = Array.from(svg.querySelectorAll<SVGGElement>(".va-node"));
    const lengths = paths.map((p) => p.getTotalLength());
    const pulses: { edge: number; t: number; dot: SVGCircleElement }[] = [];
    let attract: string | null = null;
    let raf = 0;
    let last = performance.now();
    let spawnIn = 0;

    const pickEdge = () => {
      if (attract) {
        const into = EDGES.map((e, i) => (e[1] === attract || e[0] === attract ? i : -1)).filter(
          (i) => i >= 0,
        );
        if (into.length && Math.random() < 0.8)
          return into[Math.floor(Math.random() * into.length)];
      }
      // Follow the flow: first edge most often, then the branches.
      return Math.random() < 0.3 ? 0 : 1 + Math.floor(Math.random() * (EDGES.length - 1));
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      spawnIn -= dt;
      if (spawnIn <= 0 && pulses.length < dots.length) {
        const dot = dots.find((d) => !pulses.some((p) => p.dot === d));
        if (dot) pulses.push({ edge: pickEdge(), t: 0, dot });
        spawnIn = attract ? 0.16 : 0.34;
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += dt / 0.9;
        if (p.t >= 1) {
          p.dot.setAttribute("opacity", "0");
          pulses.splice(i, 1);
          continue;
        }
        const pt = paths[p.edge].getPointAtLength(lengths[p.edge] * p.t);
        p.dot.setAttribute("cx", pt.x.toFixed(1));
        p.dot.setAttribute("cy", pt.y.toFixed(1));
        p.dot.setAttribute("opacity", String(Math.sin(p.t * Math.PI)));
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const m = svg.getScreenCTM();
      if (!m) return;
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      let best: string | null = null;
      let bestD = 70;
      for (const n of NODES) {
        const d = Math.hypot(n.x - pt.x, n.y - pt.y);
        if (d < bestD) {
          bestD = d;
          best = n.id;
        }
      }
      attract = best;
      nodes.forEach((g) => g.classList.toggle("is-hot", g.dataset.id === best));
    };
    const onLeave = () => {
      attract = null;
      nodes.forEach((g) => g.classList.remove("is-hot"));
    };
    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerleave", onLeave);
      dots.forEach((d) => d.setAttribute("opacity", "0"));
    };
  }, [active, lite]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 400"
      aria-hidden="true"
      className="va absolute inset-0 h-full w-full overflow-visible"
    >
      <g fill="none" strokeWidth="1">
        {EDGES.map((e, i) => (
          <path
            key={i}
            className="va-edge"
            d={edgePath(e)}
            stroke="var(--ice-30)"
            pathLength={1}
            strokeDasharray="1"
          />
        ))}
      </g>
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} className="va-pulse" r="3.2" fill="var(--red)" opacity="0" />
      ))}
      {NODES.map((n) => (
        <g key={n.id} className="va-node" data-id={n.id} transform={`translate(${n.x} ${n.y})`}>
          <g className="va-node-inner">
            {n.id === "agent" ? (
              <circle
                r={n.r + 9}
                fill="none"
                stroke="var(--red)"
                strokeWidth="1"
                className="va-ring"
              />
            ) : null}
            <circle
              r={n.r}
              className="va-dot"
              fill="var(--obsidian-800)"
              stroke="var(--ice)"
              strokeWidth="1.2"
            />
            <text
              y={n.id === "agent" ? 5 : n.r + 20}
              textAnchor="middle"
              className="t-mono"
              fontSize={n.id === "agent" ? 0 : 10}
              fill="var(--ice-60)"
            >
              {n.id === "agent" ? "" : n.label}
            </text>
          </g>
          {n.id === "agent" ? (
            <text
              y={-n.r - 18}
              textAnchor="middle"
              fontSize="11"
              fill="var(--ice)"
              className="t-mono va-agent-label"
            >
              AGENT
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

export const buildAgents: VisualBuild = (root, tl, w) => {
  const nodes = root.querySelectorAll(".va-node-inner");
  const edges = root.querySelectorAll(".va-edge");
  const label = root.querySelector(".va-agent-label");
  const ring = root.querySelector(".va-ring");
  if (nodes.length) {
    tl.fromTo(
      nodes,
      { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" },
      { scale: 1, autoAlpha: 1, ease: "expo.out", duration: len(w, 0.12), stagger: len(w, 0.03) },
      at(w, 0.05),
    );
  }
  if (edges.length) {
    tl.fromTo(
      edges,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, ease: "power2.inOut", duration: len(w, 0.18), stagger: len(w, 0.025) },
      at(w, 0.2),
    );
  }
  if (label)
    tl.fromTo(
      label,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, ease: "expo.out", duration: len(w, 0.1) },
      at(w, 0.16),
    );
  if (ring)
    tl.fromTo(
      ring,
      { scale: 0.6, autoAlpha: 0, transformOrigin: "50% 50%" },
      { scale: 1, autoAlpha: 1, ease: "expo.out", duration: len(w, 0.14) },
      at(w, 0.3),
    );
};
