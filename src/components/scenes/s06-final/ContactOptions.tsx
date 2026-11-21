"use client";

import { m } from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siWhatsapp } from "simple-icons";
import { final } from "@/content/final";
import { site } from "@/content/site";
import { copyText, mailtoUrl, whatsappUrl } from "@/lib/contact";
import { bezier } from "@/lib/tokens";
import { toast } from "@/store/experience";

interface ContactOptionsProps {
  onClose: () => void;
}

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: bezier.out, delay: 0.06 + i * 0.09 },
  }),
};

function CopyRow({ label, value }: { label: string; value: string }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  const textRef = useRef<HTMLSpanElement>(null);
  return (
    <p className="t-mono flex flex-wrap items-center gap-x-2 text-[11px] text-ice-60">
      <span>{final.copyPrefix}</span>
      <span ref={textRef} className="select-all text-ice">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Copy ${label}`}
        className="ml-auto inline-flex min-h-[44px] items-center gap-1.5 px-2 text-ice transition-colors duration-[var(--dur-micro)] hover:text-red"
        onClick={async () => {
          const ok = await copyText(value);
          if (ok) {
            setState("done");
            toast(final.copied);
            window.setTimeout(() => setState("idle"), 1600);
          } else {
            // Last resort: leave the text selected for a manual copy.
            setState("failed");
            const range = document.createRange();
            if (textRef.current) {
              range.selectNodeContents(textRef.current);
              window.getSelection()?.removeAllRanges();
              window.getSelection()?.addRange(range);
            }
          }
        }}
      >
        {state === "done" ? (
          <Check size={14} strokeWidth={1.5} />
        ) : (
          <Copy size={14} strokeWidth={1.5} />
        )}
        {state === "done" ? final.copied : state === "failed" ? "SELECTED" : "COPY"}
      </button>
    </p>
  );
}

/**
 * T5 — on commitment (Design.md §4, §9): the CTA splits into CHOOSE A CHANNEL and two
 * options, EMAIL and WHATSAPP, both prefilled. Copy rows below for both. Closes with ×,
 * Esc or a click outside, and hands focus back to the CTA.
 */
export default function ContactOptions({ onClose }: ContactOptionsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mailHref, setMailHref] = useState<string | undefined>(undefined);

  // The address is only assembled into a mailto: in the browser (Security.md §3).
  useEffect(() => {
    const id = requestAnimationFrame(() => setMailHref(mailtoUrl()));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    rootRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [onClose]);

  const onEmail = () => {
    // No mail app? The page keeps focus — offer the address instead (Security.md §8).
    window.setTimeout(() => {
      if (document.hasFocus()) {
        toast(final.mailFallback, {
          action: {
            label: "COPY",
            onClick: () =>
              void copyText(site.contact.email).then((ok) => ok && toast(final.copied)),
          },
        });
      }
    }, 1200);
  };

  return (
    <m.div
      ref={rootRef}
      role="group"
      aria-labelledby="contact-chooser"
      className="contact-sheet w-[min(560px,calc(100vw-2*var(--edge-x)))] border border-obsidian-700 bg-obsidian p-4 sm:p-5"
      initial={{ opacity: 0, scaleY: 0.4, y: 10 }}
      animate={{ opacity: 1, scaleY: 1, y: 0, transition: { duration: 0.45, ease: bezier.out } }}
      exit={{ opacity: 0, y: 12, transition: { duration: 0.2, ease: bezier.in } }}
      style={{ transformOrigin: "50% 100%" }}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <p id="contact-chooser" className="t-mono text-ice-60">
          {final.chooser}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close contact options"
          className="-m-2 grid h-11 w-11 place-items-center text-ice transition-colors duration-[var(--dur-micro)] hover:text-red"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <m.a
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0}
          href={mailHref}
          onClick={onEmail}
          className="contact-opt"
        >
          <Mail size={18} strokeWidth={1.5} aria-hidden="true" />
          <span className="contact-opt__label">{final.options.email}</span>
          <ArrowUpRight
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="contact-opt__arrow"
          />
        </m.a>
        <m.a
          variants={rise}
          initial="hidden"
          animate="show"
          custom={1}
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-opt"
          aria-label={`${final.options.whatsapp} (opens in a new tab)`}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d={siWhatsapp.path} fill="currentColor" />
          </svg>
          <span className="contact-opt__label">{final.options.whatsapp}</span>
          <ArrowUpRight
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="contact-opt__arrow"
          />
        </m.a>
      </div>
      <m.div
        variants={rise}
        initial="hidden"
        animate="show"
        custom={2}
        className="mt-3 border-t border-obsidian-700 pt-1"
      >
        <CopyRow label="email address" value={site.contact.email} />
        <CopyRow label="WhatsApp number" value={site.contact.whatsappDisplay} />
      </m.div>
    </m.div>
  );
}
