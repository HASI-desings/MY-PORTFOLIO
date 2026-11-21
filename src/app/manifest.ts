import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HASI DESIGNS",
    short_name: "HASI",
    description:
      "I build digital experiences, automate processes, and transform ideas into functional software.",
    start_url: "/",
    display: "standalone",
    background_color: "#111217",
    theme_color: "#111217",
  };
}
