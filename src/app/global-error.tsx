"use client";

// Root fallback when even the layout fails: self-contained, inline styles, no font
// dependency, no technical details (Security.md §6).
export default function GlobalError() {
  return (
    <html lang="en" style={{ background: "#111217" }}>
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          color: "#DFE5EB",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "0 24px",
            overflow: "hidden",
            position: "relative",
            background: "#111217",
          }}
        >
          <div
            style={{
              maxWidth: 560,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignItems: "flex-start",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
              }}
            >
              SOMETHING BROKE.
            </h1>
            <p
              style={{
                margin: 0,
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(223,229,235,.6)",
              }}
            >
              The experience hit an error. Reloading usually fixes it.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                height: 56,
                padding: "0 28px",
                border: 0,
                borderRadius: 2,
                background: "#EF233C",
                color: "#111217",
                fontWeight: 800,
                letterSpacing: "0.06em",
                cursor: "pointer",
              }}
            >
              RELOAD
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
