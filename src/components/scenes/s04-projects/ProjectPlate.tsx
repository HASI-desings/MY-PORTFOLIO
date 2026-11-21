"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import type { Project } from "@/types/content";
import { cn } from "@/lib/utils";
import StatusChip from "./StatusChip";

interface ProjectPlateProps {
  project: Project;
  index: number;
  lifted: boolean;
  dimmed: boolean;
  onLift: (slug: string | null) => void;
  onOpen: (project: Project) => void;
}

/**
 * A project plate resting on the dark surface (Design.md §9 Scene 04). Hover / focus / tap
 * lifts it off the surface (translateZ, shadow deepens, description rises, OPEN PROJECT
 * slides up); the pointer tilts it ±4°.
 */
export default function ProjectPlate({
  project,
  index,
  lifted,
  dimmed,
  onLift,
  onOpen,
}: ProjectPlateProps) {
  const tilt = useRef<HTMLDivElement>(null);
  const live = project.status === "LIVE" && project.url;

  return (
    <article
      className={cn("plate relative shrink-0", lifted && "is-lifted", dimmed && "is-dimmed")}
      onPointerEnter={(e) => e.pointerType === "mouse" && onLift(project.slug)}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        onLift(null);
        if (tilt.current) tilt.current.style.transform = "";
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !tilt.current) return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.current.style.transform = `rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg)`;
      }}
      onClick={(e) => {
        if ((e.target as Element).closest("a,button")) return;
        onLift(lifted ? null : project.slug);
      }}
      onFocus={() => onLift(project.slug)}
    >
      <span aria-hidden="true" className="plate-shadow" />
      <div ref={tilt} className="plate-tilt">
        <div className="plate-body relative aspect-[16/10] overflow-hidden border border-obsidian-700 bg-obsidian-800">
          {/* eslint-disable-next-line @next/next/no-img-element -- static asset with explicit size; next/image adds nothing for a decorative plate cover */}
          <img
            src={project.image}
            alt={project.imageAlt}
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4">
            <StatusChip status={project.status} />
          </div>
          <div className="plate-scrim absolute inset-x-0 bottom-0 p-5 pt-16">
            <p className="t-mono text-ice-60">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="t-display mt-1 text-[length:var(--fs-h2)] text-ice [font-stretch:110%]">
              {project.name}
            </h3>
            <p className="t-mono mt-1 text-ice-60">{project.category}</p>
            <div className="plate-more">
              <p className="mt-3 max-w-[48ch] text-[length:var(--fs-small)] text-ice-60">
                {project.description}
              </p>
              {live ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary mt-4"
                  aria-label={`Open ${project.name} (opens in a new tab)`}
                >
                  <span className="btn__label">OPEN PROJECT</span>
                  <span className="btn__icon" aria-hidden="true">
                    <ArrowUpRight size={16} strokeWidth={1.5} />
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  className="btn btn--primary mt-4"
                  onClick={() => onOpen(project)}
                >
                  <span className="btn__label">OPEN PROJECT</span>
                  <span className="btn__icon" aria-hidden="true">
                    <ArrowUpRight size={16} strokeWidth={1.5} />
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
