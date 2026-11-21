"use client";

// Self-contained root fallback: inline styles only, no font dependency (Security.md §6).
export default function GlobalError() {
  return (
    <html lang="en" style={{ background: "#111217", color: "#DFE5EB" }}>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
          <div>
            <h1 style={{ margin: 0 }}>SOMETHING BROKE.</h1>
            <button type="button" onClick={() => window.location.reload()}>
              RELOAD
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
