"use client";

import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { bezier } from "@/lib/tokens";

interface PanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Mono caption above the title. */
  eyebrow?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible slide-in dialog (Design.md §4 T4): closes with Esc, the × button, a click
 * outside and the mobile back gesture; traps focus while open; returns focus to its trigger.
 */
export default function Panel({ open, onClose, title, children, eyebrow }: PanelProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const pushedHistory = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;

    // Back gesture closes the panel instead of leaving the page.
    history.pushState({ hasiPanel: true }, "");
    pushedHistory.current = true;
    const onPop = () => {
      pushedHistory.current = false;
      onCloseRef.current();
    };
    window.addEventListener("popstate", onPop);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }, 50);

    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      if (pushedHistory.current) {
        pushedHistory.current = false;
        history.back();
      }
      returnTo.current?.focus?.();
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[var(--z-panel)]" key="panel">
          <m.div
            className="absolute inset-0 bg-obsidian-900/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.32 } }}
            exit={{ opacity: 0, transition: { duration: 0.24 } }}
            onClick={onClose}
            aria-hidden="true"
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 right-0 flex w-full max-w-[640px] flex-col overflow-y-auto border-l border-obsidian-700 bg-obsidian-800"
            style={{ paddingRight: "var(--safe-right)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0, transition: { duration: 0.6, ease: bezier.out } }}
            exit={{ x: "100%", transition: { duration: 0.36, ease: bezier.in } }}
          >
            <div className="flex items-start justify-between gap-6 p-6 sm:p-10">
              <div>
                {eyebrow ? <p className="t-mono mb-3 text-ice-60">{eyebrow}</p> : null}
                <h2 id={titleId} className="t-display text-[length:var(--fs-h2)] text-ice">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center text-ice transition-colors duration-[var(--dur-micro)] hover:text-red"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <div className="px-6 pb-10 sm:px-10">{children}</div>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
