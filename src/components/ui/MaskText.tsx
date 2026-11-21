import type { ElementType } from "react";
import { cn } from "@/lib/utils";

interface MaskTextProps {
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** Hook for scene timelines: `[data-mask="<id>"] .mask-line__inner`. */
  id?: string;
}

/**
 * Mask-rise primitive (Design.md §7): each line sits in an overflow-hidden wrapper so its
 * inner span can rise from 110 % to 0. Screen readers get the sentence once, unbroken.
 * The motion itself is driven by the owning scene's timeline.
 */
export default function MaskText({
  lines,
  as: Tag = "p",
  className,
  lineClassName,
  id,
}: MaskTextProps) {
  return (
    <Tag className={className} data-mask={id}>
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, i) => (
        <span key={i} className={cn("mask-line", lineClassName)} aria-hidden="true">
          <span className="mask-line__inner">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
