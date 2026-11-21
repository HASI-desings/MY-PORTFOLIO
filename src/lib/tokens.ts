// JS mirror of the CSS tokens in globals.css, for GSAP, three.js and canvas drawing.
// Change both together.

export const color = {
  obsidian: "#111217",
  ice: "#DFE5EB",
  red: "#EF233C",
  obsidian900: "#0B0C10",
  obsidian800: "#16171D",
  obsidian700: "#1E2028",
  graphite: "#2B2E36",
  redDeep: "#B8172B",
} as const;

/** Measured from ME.png's backdrop (DECISIONS D-016): centre in photo fractions, stops by radius. */
export const studio = {
  centerX: 0.5,
  centerY: 0.65,
  aspect: 1.3,
  stops: [
    { r: 0, hex: "#FCFCFC" },
    { r: 0.4, hex: "#FBFBFB" },
    { r: 0.5, hex: "#E9E9E9" },
    { r: 0.6, hex: "#CACACA" },
    { r: 0.7, hex: "#A5A5A5" },
    { r: 0.8, hex: "#828282" },
    { r: 0.9, hex: "#727272" },
  ],
} as const;

/** GSAP-compatible easings matching the CSS cubic-beziers. */
export const ease = {
  out: "expo.out", // ≈ cubic-bezier(0.16, 1, 0.3, 1)
  inOut: "power3.inOut", // ≈ cubic-bezier(0.65, 0, 0.35, 1)
  in: "power4.in", // ≈ cubic-bezier(0.7, 0, 0.84, 0)
} as const;

/** CSS cubic-bezier strings for Framer Motion. */
export const bezier = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  in: [0.7, 0, 0.84, 0] as [number, number, number, number],
};

/** Durations in seconds. */
export const dur = {
  micro: 0.18,
  short: 0.32,
  med: 0.6,
  long: 0.9,
  cine: 1.4,
} as const;

export const stagger = {
  letters: 0.06,
  list: 0.09,
  tools: 0.14,
} as const;

/** The red diagonal used by the RED CUT, Scene 01 and Scene 06 planes. */
export const DIAGONAL_DEG = -18;
