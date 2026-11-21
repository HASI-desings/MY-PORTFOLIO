// Shapes for every file in src/content. Components read content only through these types,
// so editing copy or adding a project never touches animation code.

export type ProjectStatus = "LIVE" | "IN_DEVELOPMENT" | "CONCEPT";

export interface Project {
  slug: string;
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  /** Must start with https:// — anything else is treated as "no live link" (Security.md §3). */
  url?: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  order: number;
}

export type ToolGroup = "AI" | "Design" | "Development" | "Infrastructure";

export interface Tool {
  id: string;
  name: string;
  group: ToolGroup;
  line: string;
  /** Simple Icons slug. Omitted when the library has no official mark → Archivo monogram tile. */
  simpleIconSlug?: string;
  featured?: boolean;
}

export type DisciplineVisual = "web" | "agents" | "saas" | "pos" | "trading" | "design";

export interface Discipline {
  index: string;
  title: string;
  line: string;
  tags: string[];
  visualId: DisciplineVisual;
}
