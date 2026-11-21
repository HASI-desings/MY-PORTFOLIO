"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { rememberLite } from "@/lib/tier";
import { useExperience } from "@/store/experience";

const MESSAGE = "Taking longer than usual — building the experience…";
const noopSubscribe = () => () => undefined;

/** Stage from time since navigation started — slow connections can hydrate after 6 s. */
const stageNow = (): 0 | 1 | 2 => {
  const t = performance.now();
  return t >= 12000 ? 2 : t >= 6000 ? 1 : 0;
};

/**
 * Never stare at nothing (Security.md §4): after 6 s a calm note, after 12 s a way in.
 * Before JavaScript has arrived, a CSS-timed copy of the note covers the gap.
 * "Enter lite version" switches to the lite tier and enters immediately.
 */
export default function SlowNotice() {
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const loaderState = useExperience((s) => s.loaderState);

  useEffect(() => {
    const tick = () => setStage(stageNow());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 500);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  if (!hydrated) {
    return (
      <span className="slow-css t-mono text-ice-60" role="status">
        {MESSAGE}
      </span>
    );
  }
  if (stage === 0 || loaderState !== "loading") return null;

  return (
    <div className="flex flex-col items-start gap-3" role="status">
      <span className="t-mono text-ice-60">{MESSAGE}</span>
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
