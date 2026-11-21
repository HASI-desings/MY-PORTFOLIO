import type { ReactNode } from "react";
import type { SceneId } from "@/store/experience";
import { cn } from "@/lib/utils";

interface SceneShellProps {
  id: SceneId;
  /** Accessible name of the scene region. */
  label: string;
  className?: string;
  children: ReactNode;
}

/**
 * The shared frame of every scene: one <section> that is a fixed, full-screen layer in
 * cinematic mode (the director clips, fades and toggles it) and a normal full-height
 * section in static mode.
 */
export default function SceneShell({ id, label, className, children }: SceneShellProps) {
  return (
    <section
      id={`scene-${id}`}
      data-scene-layer={id}
      aria-label={label}
      className={cn("scene", className)}
      style={{ zIndex: "var(--z-scene)" }}
    >
      {children}
    </section>
  );
}
