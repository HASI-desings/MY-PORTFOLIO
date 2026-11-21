import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StatusChip from "@/components/scenes/s04-projects/StatusChip";
import { publishedProjects } from "@/content/projects";
import { site } from "@/content/site";

// Only known, non-live projects get a detail page; every other slug is a 404 (Security.md §3).
export const dynamicParams = false;

const detailProjects = () => publishedProjects.filter((p) => p.status !== "LIVE");

export function generateStaticParams() {
  return detailProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = detailProjects().find((p) => p.slug === slug);
  return project
    ? { title: `${project.name} — ${site.brand}`, description: project.description }
    : {};
}

/** Shareable detail view for projects without a live link (Design.md §9 Scene 04). */
export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = detailProjects().find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="min-h-[100svh] bg-obsidian px-[var(--edge-x)] pb-24 pt-[calc(96px+var(--safe-top))]">
      <Link
        href="/"
        className="t-mono draw-line inline-flex min-h-[44px] items-center text-ice-60 hover:text-ice"
      >
        ← {site.brand}
      </Link>
      <article className="mx-auto mt-10 grid max-w-[var(--content-max)] gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          {/* eslint-disable-next-line @next/next/no-img-element -- static cover with explicit size */}
          <img
            src={project.image}
            alt={project.imageAlt}
            width={1600}
            height={1000}
            className="aspect-[16/10] w-full border border-obsidian-700 object-cover"
          />
        </div>
        <div className="flex flex-col gap-5 md:col-span-5">
          <p className="t-mono text-ice-60">{project.category}</p>
          <h1 className="t-display text-[length:var(--fs-h1)] text-ice">{project.name}</h1>
          <StatusChip status={project.status} />
          <p className="max-w-[60ch] text-[length:var(--fs-body-l)] leading-relaxed text-ice">
            {project.description}
          </p>
          <p className="t-mono text-ice-60">Live link not available yet</p>
        </div>
      </article>
    </main>
  );
}
