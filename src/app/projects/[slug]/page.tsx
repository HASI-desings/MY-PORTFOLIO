import { notFound } from "next/navigation";
import { publishedProjects } from "@/content/projects";

// Only known, non-live projects get a detail page; every other slug is a 404 (Security.md §3).
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedProjects.filter((p) => p.status !== "LIVE").map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = publishedProjects.find((p) => p.slug === slug && p.status !== "LIVE");
  if (!project) notFound();

  // Full detail layout is built in Phase 9.
  return (
    <main>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
    </main>
  );
}
