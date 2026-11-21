import type { ProjectStatus } from "@/types/content";
import { cn } from "@/lib/utils";

const LABEL: Record<ProjectStatus, string> = {
  LIVE: "LIVE",
  IN_DEVELOPMENT: "IN DEVELOPMENT",
  CONCEPT: "CONCEPT",
};

/** Honest status (Rules.md §1.4): LIVE pulses red, IN DEVELOPMENT is outlined, CONCEPT dashed. */
export default function StatusChip({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "t-mono inline-flex items-center gap-2 rounded-[2px] bg-obsidian/80 px-2.5 py-1.5 text-[11px] text-ice",
        status === "IN_DEVELOPMENT" && "border border-ice",
        status === "CONCEPT" && "border border-dashed border-ice-30",
      )}
    >
      {status === "LIVE" ? (
        <span aria-hidden="true" className="status-live h-1.5 w-1.5 rounded-full bg-red" />
      ) : null}
      {LABEL[status]}
    </span>
  );
}
