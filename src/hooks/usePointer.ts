"use client";

import { useEffect } from "react";

/**
 * Shared normalized pointer (−1…1 from the viewport centre), lerped every frame by the
 * consumer. A single module-level object avoids React re-renders on every mouse move.
 */
export const pointer = { x: 0, y: 0, active: false };

let listeners = 0;
const onMove = (e: PointerEvent) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  pointer.active = true;
};

export function usePointer() {
  useEffect(() => {
    if (listeners++ === 0) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (--listeners === 0) window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return pointer;
}
