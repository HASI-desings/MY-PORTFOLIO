import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  ice: "text-ice",
  dim: "text-ice-60",
  faint: "text-ice-30",
  inherit: "",
} as const;

interface MonoLabelProps {
  children: ReactNode;
  tone?: keyof typeof tones;
  as?: "span" | "p" | "div" | "h2";
  className?: string;
}

/** Geist Mono, uppercase, tracked — indices, counters, metadata (Design.md §3). */
export default function MonoLabel({
  children,
  tone = "dim",
  as: Tag = "span",
  className,
}: MonoLabelProps) {
  return <Tag className={cn("t-mono", tones[tone], className)}>{children}</Tag>;
}
