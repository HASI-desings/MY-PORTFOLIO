"use client";

// Branded error screen is designed in Phase 12 (Security.md §6).
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <h1>Something broke.</h1>
      <button type="button" onClick={() => reset()}>
        Retry
      </button>
    </main>
  );
}
