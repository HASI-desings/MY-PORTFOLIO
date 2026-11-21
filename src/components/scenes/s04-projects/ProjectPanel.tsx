"use client";

import Panel from "@/components/ui/Panel";
import type { Project } from "@/types/content";
import StatusChip from "./StatusChip";

/** T4 detail for projects without a live link (Design.md §9 Scene 04). */
export default function ProjectPanel({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <Panel
      open={!!project}
      onClose={onClose}
      title={project?.name ?? ""}
      eyebrow={project?.category}
    >
      {project ? (
        <div className="flex flex-col gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element -- cover with explicit size inside a dialog */}
          <img
            src={project.image}
            alt={project.imageAlt}
            width={1600}
            height={1000}
            className="aspect-[16/10] w-full border border-obsidian-700 object-cover"
          />
          <StatusChip status={project.status} />
          <p className="max-w-[60ch] text-[length:var(--fs-body-l)] leading-relaxed text-ice">
            {project.description}
          </p>
          <p className="t-mono text-ice-60">Live link not available yet</p>
        </div>
      ) : null}
    </Panel>
  );
}
