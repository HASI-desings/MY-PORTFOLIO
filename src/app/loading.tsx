// Pre-hydration frame: obsidian only. The HASI outline is added with the loader (Phase 5).
export default function Loading() {
  return <div aria-hidden="true" style={{ position: "fixed", inset: 0, background: "#111217" }} />;
}
