"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect } from "react";
import { useExperience, type ToastItem } from "@/store/experience";
import { bezier } from "@/lib/tokens";

function ToastRow({ item }: { item: ToastItem }) {
  const dismiss = useExperience((s) => s.dismissToast);
  const duration = item.duration ?? (item.action ? 6000 : 3200);

  useEffect(() => {
    if (!duration) return;
    const t = window.setTimeout(() => dismiss(item.id), duration);
    return () => window.clearTimeout(t);
  }, [dismiss, duration, item.id]);

  return (
    <m.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: bezier.out } }}
      exit={{ opacity: 0, y: 8, transition: { duration: 0.18, ease: bezier.in } }}
      className="pointer-events-auto flex items-center gap-4 border border-obsidian-700 bg-obsidian-800 px-4 py-3 text-sm text-ice shadow-[0_20px_40px_-20px_rgb(0_0_0/0.8)]"
    >
      <span className="h-1.5 w-1.5 shrink-0 bg-red" aria-hidden="true" />
      <span className="t-mono text-ice">{item.message}</span>
      {item.action ? (
        <button
          type="button"
          className="t-mono min-h-[44px] px-2 text-ice underline decoration-red underline-offset-4"
          onClick={() => {
            item.action?.onClick();
            dismiss(item.id);
          }}
        >
          {item.action.label}
        </button>
      ) : null}
    </m.li>
  );
}

/** "COPIED", offline / back-online and mail-fallback notices. Polite live region. */
export default function Toast() {
  const toasts = useExperience((s) => s.toasts);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-[var(--z-panel)] mx-auto w-max max-w-[calc(100vw-32px)]"
      style={{ bottom: "calc(72px + var(--safe-bottom))" }}
    >
      <ol className="flex flex-col items-center gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <ToastRow key={t.id} item={t} />
          ))}
        </AnimatePresence>
      </ol>
    </div>
  );
}
