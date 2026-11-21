import { easeInOutCubic } from "@/lib/utils";

/**
 * Depth push (Design.md §7): the outgoing layer scales to 1.08 and fades while the incoming
 * one rises from 0.96. The director applies these values to scene layers; 3D scenes read
 * the same curve to dolly the camera forward.
 */
export function depthPush(p: number) {
  const e = easeInOutCubic(p);
  return {
    outgoing: { scale: 1 + 0.08 * e, opacity: 1 - e },
    incoming: { scale: 0.96 + 0.04 * e, opacity: e },
    /** World units the 3D camera travels forward through the outgoing scene. */
    dolly: 6 * e,
  };
}

export default depthPush;
