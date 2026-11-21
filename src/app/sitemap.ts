import type { MetadataRoute } from "next";
import { publishedProjects } from "@/content/projects";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...publishedProjects
      .filter((p) => p.status !== "LIVE")
      .map((p) => ({
        url: `${base}/projects/${p.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
