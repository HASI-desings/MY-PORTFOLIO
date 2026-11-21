import type { ReactNode } from "react";

interface StatusPageProps {
  ghost: string;
  title: string;
  line: string;
  children: ReactNode;
}

/**
 * Branded full-screen message used by the 404 and error pages (Security.md §6): a giant
 * ghost word, one headline, one mono line, the actions, and the red diagonal low-right.
 */
export default function StatusPage({ ghost, title, line, children }: StatusPageProps) {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-obsidian px-[var(--edge-x)]">
      <div aria-hidden="true" className="status-plane" />
      <p
        aria-hidden="true"
        className="t-hasi pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[length:var(--fs-mega)] text-ice-10"
      >
        {ghost}
      </p>
      <div className="relative flex max-w-[40rem] flex-col items-start gap-5">
        <h1 className="t-display text-[length:var(--fs-h1)] text-ice">{title}</h1>
        <p className="t-mono text-ice-60">{line}</p>
        <div className="mt-2 flex flex-wrap gap-3">{children}</div>
      </div>
    </main>
  );
}
