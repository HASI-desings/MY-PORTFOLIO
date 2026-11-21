import type { Tool } from "@/types/content";

// The tools Hussnain really uses — Design.md §9 Scene 02. Order = entry order.
// `simpleIconSlug` omitted → the library has no official mark → Archivo monogram tile (D-005).
export const toolkit: Tool[] = [
  {
    id: "claude",
    name: "Claude",
    group: "AI",
    line: "AI pair-engineer for building, reviewing and shipping code.",
    simpleIconSlug: "claude",
  },
  { id: "chatgpt", name: "ChatGPT", group: "AI", line: "Research, ideation and prompt drafting." },
  {
    id: "figma",
    name: "Figma",
    group: "Design",
    line: "Interfaces, flows and design systems.",
    simpleIconSlug: "figma",
  },
  { id: "vscode", name: "VS Code", group: "Development", line: "Daily editor for every project." },
  {
    id: "github",
    name: "GitHub",
    group: "Development",
    line: "Version control and open-source work.",
    simpleIconSlug: "github",
  },
  {
    id: "java",
    name: "Java",
    group: "Development",
    line: "OOP foundations and desktop applications.",
    simpleIconSlug: "openjdk",
  },
  {
    id: "javascript",
    name: "JavaScript",
    group: "Development",
    line: "The language of everything interactive.",
    simpleIconSlug: "javascript",
  },
  {
    id: "typescript",
    name: "TypeScript",
    group: "Development",
    line: "Typed, safer large codebases.",
    simpleIconSlug: "typescript",
  },
  {
    id: "react",
    name: "React",
    group: "Development",
    line: "Component-driven interfaces.",
    simpleIconSlug: "react",
  },
  {
    id: "nextjs",
    name: "Next.js",
    group: "Development",
    line: "Full-stack web apps and sites.",
    simpleIconSlug: "nextdotjs",
  },
  {
    id: "html",
    name: "HTML",
    group: "Development",
    line: "Semantic structure.",
    simpleIconSlug: "html5",
  },
  {
    id: "css",
    name: "CSS",
    group: "Development",
    line: "Layout, motion and visual craft.",
    simpleIconSlug: "css",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    group: "Development",
    line: "Fast, consistent styling systems.",
    simpleIconSlug: "tailwindcss",
  },
  {
    id: "python",
    name: "Python",
    group: "Development",
    line: "Automation, scripts and AI model training.",
    simpleIconSlug: "python",
  },
  {
    id: "vercel",
    name: "Vercel",
    group: "Infrastructure",
    line: "Deploying and hosting.",
    simpleIconSlug: "vercel",
  },
  {
    id: "supabase",
    name: "Supabase",
    group: "Infrastructure",
    line: "Databases, auth and realtime backends.",
    simpleIconSlug: "supabase",
  },
  {
    id: "linux",
    name: "Linux",
    group: "Infrastructure",
    line: "Daily development environment.",
    simpleIconSlug: "linux",
  },
];

export const toolkitScene = {
  label: "TOOLKIT",
  title: "THE ECOSYSTEM",
} as const;
