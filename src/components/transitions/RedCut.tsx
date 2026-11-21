/**
 * THE RED CUT band. Geometry and timing live in lib/director.ts (redCutGeometry): the band's
 * clip-path is set on every scroll update during a cut, and the outgoing / incoming scene
 * layers are clipped by its leading / trailing edges.
 */
export default function RedCut() {
  return (
    <div
      id="red-cut"
      aria-hidden="true"
      className="cine-only pointer-events-none fixed inset-0 bg-red"
      style={{ zIndex: "var(--z-cut)", visibility: "hidden" }}
    />
  );
}
