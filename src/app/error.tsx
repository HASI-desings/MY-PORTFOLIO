"use client";

import StatusPage from "@/components/ui/StatusPage";
import { rememberLite } from "@/lib/tier";

/** Route-level error boundary (Security.md §6). No stack traces for visitors. */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusPage
      ghost="ERR"
      title="SOMETHING BROKE."
      line="The experience hit an error. You can retry or continue with the lite version."
    >
      <button type="button" className="btn btn--primary btn--lg" onClick={() => reset()}>
        <span className="btn__label">RETRY</span>
      </button>
      <button
        type="button"
        className="btn btn--outline btn--lg"
        onClick={() => {
          // The boundary remounts the page, which re-detects the tier as lite.
          rememberLite();
          reset();
        }}
      >
        <span className="btn__label">LITE VERSION</span>
      </button>
    </StatusPage>
  );
}
