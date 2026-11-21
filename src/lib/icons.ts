import {
  siClaude,
  siCss,
  siFigma,
  siGithub,
  siHtml5,
  siJavascript,
  siLinux,
  siNextdotjs,
  siOpenjdk,
  siPython,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
} from "simple-icons";

/** Official marks from Simple Icons (24×24 paths). Trademarks of their owners (Design.md §12). */
export interface BrandIcon {
  path: string;
  /** Brand colour, shown only on hover/focus. Near-black marks show in white instead. */
  hex: string;
  title: string;
}

const raw = {
  claude: siClaude,
  figma: siFigma,
  github: siGithub,
  openjdk: siOpenjdk,
  javascript: siJavascript,
  typescript: siTypescript,
  react: siReact,
  nextdotjs: siNextdotjs,
  html5: siHtml5,
  css: siCss,
  tailwindcss: siTailwindcss,
  python: siPython,
  vercel: siVercel,
  supabase: siSupabase,
  linux: siLinux,
} as const;

function readableOnDark(hex: string) {
  const n = parseInt(hex, 16);
  const lum = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return lum < 0.18 ? "#FFFFFF" : `#${hex}`;
}

export const brandIcons: Record<string, BrandIcon> = Object.fromEntries(
  Object.entries(raw).map(([slug, icon]) => [
    slug,
    { path: icon.path, hex: readableOnDark(icon.hex), title: icon.title },
  ]),
);

export const iconFor = (slug?: string) => (slug ? brandIcons[slug] : undefined);

/** Short monogram for tools the library no longer carries (ChatGPT, VS Code — DECISIONS D-005). */
export function monogramLines(name: string) {
  if (name === "ChatGPT") return ["CHAT", "GPT"];
  if (name === "VS Code") return ["VS", "CODE"];
  return name.toUpperCase().split(" ");
}
