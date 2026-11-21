"use client";

import { useEffect, useState } from "react";
import { rememberLite } from "@/lib/tier";
import { useExperience } from "@/store/experience";

/**
 * Never stare at nothing (Security.md §4): after 6 s a calm note, after 12 s a way in.
 * "Enter lite version" switches to the lite tier and enters immediately.
 */
export default function SlowNotice() {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const loaderState = useExperience((s) => s.loaderState);

  useEffect(() => {
    const a = window.setTimeout(() => setStage(1), 6000);
    const b = window.setTimeout(() => setStage(2), 12000);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  if (stage === 0 || loaderState !== "loading") return null;

  return (
    <div className="flex flex-col items-start gap-3" role="status">
      <span className="t-mono text-ice-60">
        Taking longer than usual — building the experience…
      </span>
      {stage === 2 ? (
        <button
          type="button"
          className="btn btn--outline"
          onClick={() => {
            rememberLite();
            const s = useExperience.getState();
            s.setTier("low");
            s.setLoaderState("exiting");
          }}
        >
          <span className="btn__label">ENTER LITE VERSION</span>
        </button>
      ) : null}
    </div>
  );
}
