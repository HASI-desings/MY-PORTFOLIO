import { Fragment, type ElementType } from "react";
import { cn } from "@/lib/utils";

interface SplitLettersProps {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  /** Hook for scene timelines: `[data-split="<id>"] .letter`. */
  id?: string;
}

/**
 * Letter-build primitive (Design.md §7). Words never break mid-word; every letter is its own
 * transformable span; the accessible text stays a single readable string.
 */
export default function SplitLetters({
  text,
  as: Tag = "span",
  className,
  wordClassName,
  id,
}: SplitLettersProps) {
  const words = text.split(" ");
  return (
    <Tag className={className} data-split={id}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <Fragment key={w}>
            <span className={cn("word", wordClassName)} data-word={w}>
              {Array.from(word).map((ch, i) => (
                <span key={i} className="letter">
                  {ch}
                </span>
              ))}
            </span>
            {w < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
