"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MaskText from "@/components/ui/MaskText";
import MonoLabel from "@/components/ui/MonoLabel";
import { publishedProjects } from "@/content/projects";
import { useSceneProgress, useSceneTimeline } from "@/hooks/useScene";
import { useExperience } from "@/store/experience";
import type { Project } from "@/types/content";
import SceneShell from "../SceneShell";
import ProjectPanel from "./ProjectPanel";
import ProjectPlate from "./ProjectPlate";

/**
 * SCENE 04 — SELECTED PROJECTS (Design.md §9). Real work as plates on a dark surface seen
 * slightly from above; the row travels sideways with scroll and the plate nearest the
 * centre gets a soft pre-lift. Live projects open their URL; others open a detail panel
 * (shareable as ?project=slug). Renders only when projects.ts has entries (DECISIONS D-012).
 */
export default function Scene04Projects() {
  const index = useExperience((s) => s.scenes.indexOf("projects"));
  const [lifted, setLifted] = useState<string | null>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // ?project=slug opens the panel — known slugs only, anything else is ignored (Security.md §3).
  useEffect(() => {
    const slug = new URLSearchParams(location.search).get("project");
    const match = publishedProjects.find((p) => p.slug === slug && p.status !== "LIVE");
    if (!match) return;
    const id = requestAnimationFrame(() => setOpen(match));
    return () => cancelAnimationFrame(id);
  }, []);

  const openProject = useCallback((p: Project) => {
    setOpen(p);
    const url = new URL(location.href);
    url.searchParams.set("project", p.slug);
    history.replaceState(history.state, "", url);
  }, []);

  const closeProject = useCallback(() => {
    setOpen(null);
    const url = new URL(location.href);
    url.searchParams.delete("project");
    history.replaceState(history.state, "", url);
  }, []);

  // Pre-lift the plate closest to the centre while the row travels.
  useSceneProgress("projects", () => {
    const row = rowRef.current;
    if (!row) return;
    const mid = window.innerWidth / 2;
    let best: HTMLElement | null = null;
    let bestD = Infinity;
    row.querySelectorAll<HTMLElement>(".plate").forEach((el) => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = el;
      }
    });
    row
      .querySelectorAll<HTMLElement>(".plate")
      .forEach((el) => el.toggleAttribute("data-near", el === best));
  });

  useSceneTimeline("projects", (tl, ctx) => {
    const lines = titleRef.current?.querySelectorAll(".mask-line__inner");
    if (lines?.length)
      tl.fromTo(
        lines,
        { y: 0, yPercent: 110 },
        { y: 0, yPercent: 0, ease: "expo.out", duration: 0.1 },
        0.01,
      );
    const row = rowRef.current;
    if (!row) return;
    const plates = row.querySelectorAll(".plate");
    tl.fromTo(
      plates,
      { y: 80, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, ease: "expo.out", duration: 0.1, stagger: 0.03 },
      0.04,
    );
    const travel = Math.max(0, row.scrollWidth - ctx.vw + ctx.vw * 0.2);
    if (ctx.mobile) {
      const travelY = Math.max(0, row.scrollHeight - ctx.vh * 0.6);
      tl.fromTo(row, { y: 0 }, { y: -travelY, ease: "none", duration: 0.8 }, 0.15);
    } else {
      tl.fromTo(row, { x: 0 }, { x: -travel, ease: "none", duration: 0.8 }, 0.15);
    }
  });

  return (
    <SceneShell id="projects" label="Selected projects">
      <div
        ref={titleRef}
        className="absolute flex flex-col gap-3"
        style={{
          left: "var(--edge-x)",
          top: "calc(clamp(72px, 12svh, 120px) + var(--safe-top))",
          zIndex: "var(--z-scene-fg)",
        }}
      >
        <MonoLabel tone="dim">{String(index + 1).padStart(2, "0")} — WORK</MonoLabel>
        <MaskText
          as="h2"
          lines={["SELECTED PROJECTS"]}
          className="t-display text-[length:var(--fs-h1)] text-ice"
        />
      </div>
      <div className="projects-surface absolute inset-x-0 bottom-0 top-[30%]">
        <div ref={rowRef} className="projects-row">
          {publishedProjects.map((p, i) => (
            <ProjectPlate
              key={p.slug}
              project={p}
              index={i}
              lifted={lifted === p.slug}
              dimmed={!!lifted && lifted !== p.slug}
              onLift={setLifted}
              onOpen={openProject}
            />
          ))}
        </div>
      </div>
      <ProjectPanel project={open} onClose={closeProject} />
    </SceneShell>
  );
}
