import type { Discipline } from "@/types/content";

// Design.md §9 Scene 03. Tags use only tools/practices from the brief.
export const disciplines: Discipline[] = [
  {
    index: "01",
    title: "Websites & Digital Experiences",
    line: "Responsive sites, landing pages and immersive web.",
    tags: ["NEXT.JS", "REACT", "GSAP", "THREE.JS"],
    visualId: "web",
  },
  {
    index: "02",
    title: "AI Automation & Agentic Systems",
    line: "Agents, AI workflows and automated business processes.",
    tags: ["CLAUDE", "PYTHON", "APIS", "AGENTS"],
    visualId: "agents",
  },
  {
    index: "03",
    title: "Custom Software & SaaS",
    line: "Custom applications, platforms and SaaS products.",
    tags: ["TYPESCRIPT", "SUPABASE", "DASHBOARDS"],
    visualId: "saas",
  },
  {
    index: "04",
    title: "POS & Business Management",
    line: "Point of sale, billing, inventory, staff, expenses, analytics.",
    tags: ["OFFLINE-FIRST", "BILLING", "INVENTORY"],
    visualId: "pos",
  },
  {
    index: "05",
    title: "Trading & Financial Technology",
    line: "Trading tools, TradingView indicators, automation, fintech apps.",
    tags: ["TRADINGVIEW", "INDICATORS", "AUTOMATION"],
    visualId: "trading",
  },
  {
    index: "06",
    title: "UI/UX & Product Design",
    line: "Interfaces, design systems, prototypes, interaction design.",
    tags: ["FIGMA", "DESIGN SYSTEMS", "PROTOTYPING"],
    visualId: "design",
  },
];

export const createScene = {
  label: "WHAT I CREATE",
} as const;
