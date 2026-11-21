import type { Project } from "@/types/content";

// Empty on purpose: no projects are displayed for now (DECISIONS D-012).
// While this list is empty, Scene 04 does not render and the film plays as five scenes.
// To publish a project, add one object here (and its image in public/projects/) — nothing else changes.
export const projects: Project[] = [];

const isSafeUrl = (url?: string) => typeof url === "string" && url.startsWith("https://");

/** Projects in display order, with any non-https URL dropped (Security.md §3). */
export const publishedProjects: Project[] = [...projects]
  .sort((a, b) => a.order - b.order)
  .map((p) => (isSafeUrl(p.url) ? p : { ...p, url: undefined }));
