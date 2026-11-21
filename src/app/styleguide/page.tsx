"use client";

// TEMPORARY (Phases.md Phase 4): renders every token and primitive for a visual check.
// Deleted before Phase 12.
import { LazyMotion, domAnimation } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import MaskText from "@/components/ui/MaskText";
import MonoLabel from "@/components/ui/MonoLabel";
import Panel from "@/components/ui/Panel";
import SplitLetters from "@/components/ui/SplitLetters";
import Toast from "@/components/ui/Toast";
import { toast } from "@/store/experience";

const swatches = [
  ["--obsidian", "#111217"],
  ["--obsidian-900", "#0B0C10"],
  ["--obsidian-800", "#16171D"],
  ["--obsidian-700", "#1E2028"],
  ["--graphite", "#2B2E36"],
  ["--ice", "#DFE5EB"],
  ["--ice-60", ""],
  ["--ice-30", ""],
  ["--ice-10", ""],
  ["--red", "#EF233C"],
  ["--red-deep", "#B8172B"],
];

export default function Styleguide() {
  const [open, setOpen] = useState(false);
  return (
    <LazyMotion features={domAnimation} strict>
      <main className="space-y-16 px-[var(--margin)] py-16">
        <section className="flex flex-wrap gap-3">
          {swatches.map(([v]) => (
            <div key={v} className="w-28">
              <div
                className="h-16 border border-obsidian-700"
                style={{ background: `var(${v})` }}
              />
              <MonoLabel tone="faint">{v}</MonoLabel>
            </div>
          ))}
        </section>
        <section className="space-y-4">
          <p className="t-hasi text-[length:var(--fs-mega)] text-ice">HASI</p>
          <p className="t-condensed text-[length:var(--fs-giant)]">CREATIVITY</p>
          <p className="t-display text-[length:var(--fs-h1)]">THE ECOSYSTEM</p>
          <p className="t-display text-[length:var(--fs-h2)]">HUSSNAIN SOHAIL</p>
          <p className="max-w-[60ch] text-[length:var(--fs-body-l)]">
            I build digital experiences, automate processes, and transform ideas into functional
            software.
          </p>
          <MonoLabel>Founder / Developer / Digital Creator</MonoLabel>
          <MaskText lines={["Mask", "rise"]} className="t-display text-[length:var(--fs-h2)]" />
          <SplitLetters text="NOT A TRAIT." className="t-condensed text-[length:var(--fs-h1)]" />
        </section>
        <section className="flex flex-wrap items-center gap-4">
          <Button variant="primary" size="lg">
            LET&apos;S MAKE IT REAL
          </Button>
          <Button icon={<ArrowUpRight size={14} />}>Email</Button>
          <Button state="loading">Loading</Button>
          <Button state="success">Done</Button>
          <Button state="error">Error</Button>
          <Button disabled>Disabled</Button>
          <Button variant="ghost" onClick={() => toast("COPIED")}>
            Toast
          </Button>
          <Button onClick={() => setOpen(true)}>Open panel</Button>
        </section>
        <Panel open={open} onClose={() => setOpen(false)} title="Panel" eyebrow="T4 · DIALOG">
          <p className="text-ice-60">Esc, ×, outside click and back gesture all close this.</p>
        </Panel>
        <Toast />
      </main>
    </LazyMotion>
  );
}
