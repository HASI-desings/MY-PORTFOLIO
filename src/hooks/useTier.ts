"use client";

import { useExperience } from "@/store/experience";

/** Current quality tier (high / mid / low / none). */
export const useTier = () => useExperience((s) => s.tier);

/** True when 3D is allowed and has not crashed or lost its context. */
export const useThreeEnabled = () =>
  useExperience((s) => (s.tier === "high" || s.tier === "mid") && !s.webglLost);
