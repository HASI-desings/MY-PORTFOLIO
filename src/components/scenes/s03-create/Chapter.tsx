"use client";

import { useId, useState, type ReactNode } from "react";
import MaskText from "@/components/ui/MaskText";
import type { Discipline } from "@/types/content";
import { cn } from "@/lib/utils";

interface ChapterProps {
  discipline: Discipline;
  children: ReactNode;
}

/**
 * One discipline (Design.md §9 Scene 03): ghost index, title, one line and — on intent —
 * its tags (hover / focus / tap the title). The right side holds the chapter's live visual.
 */
export default function Chapter({ discipline, children }: ChapterProps) {
  const [open, setOpen] = useState(false);
  const tagsId = useId();

  return (
    <article
      data-chapter={discipline.visualId}
      aria-label={discipline.title}
      className="chapter relative grid h-full w-full shrink-0 grid-rows-[auto_1fr] gap-6 px-[var(--edge-x)] pb-[calc(84px+var(--safe-bottom))] pt-[calc(clamp(104px,16svh,150px)+var(--safe-top))] md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-[var(--gutter)] md:pb-[calc(96px+var(--safe-bottom))] short:pt-16"
    >
      <div className="chapter-copy relative md:col-span-5">
        <span
          aria-hidden="true"
          className="chapter-index t-condensed pointer-events-none absolute -top-[0.35em] left-[-0.04em] select-none text-[length:var(--fs-giant)] leading-none text-ice-10"
        >
          {discipline.index}
        </span>
        <div className="relative pt-[clamp(2.5rem,7svh,5.5rem)]">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={tagsId}
            onClick={() => setOpen((v) => !v)}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            className="group block text-left"
          >
            <MaskText
              as="h3"
              lines={[discipline.title]}
              className="chapter-title t-display max-w-[14ch] text-[clamp(2rem,4.6vw,5rem)] leading-[0.92] text-ice [font-stretch:92%]"
            />
          </button>
          <MaskText
            lines={[discipline.line]}
            className="chapter-line mt-5 max-w-[34ch] text-[length:var(--fs-body-l)] leading-[1.45] text-ice-60"
          />
          <ul
            id={tagsId}
            aria-label="Tools and practices"
            className={cn(
              "mt-6 flex flex-wrap gap-2 transition-[opacity,transform] duration-[var(--dur-short)] ease-[var(--ease-out)]",
              open
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0",
            )}
          >
            {discipline.tags.map((tag) => (
              <li
                key={tag}
                className="t-mono rounded-[2px] border border-ice-30 px-2.5 py-1.5 text-[11px] text-ice"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="chapter-visual relative min-h-0 md:col-span-7 md:h-[min(62svh,620px)]">
        {children}
      </div>
    </article>
  );
}
