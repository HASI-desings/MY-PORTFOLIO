"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useExperience } from "@/store/experience";
import { easeOutExpo } from "@/lib/utils";
import { CAMERA_FOV, CAMERA_Z } from "./CameraRig";
import { clip, signalRedMaterial } from "./materials";

const Z = -1.6;
const ANGLE = (18 * Math.PI) / 180;

/**
 * Scene 01's red diagonal (Design.md §9): a sharp plane behind the letters, rising at 18°
 * from the bottom-left corner toward mid-right, ~25 % of the frame (owner's call, D-003).
 * It slides in from the left after the loader hands off.
 */
export default function RedPlane() {
  const size = useThree((s) => s.size);
  const loaderState = useExperience((s) => s.loaderState);
  const mesh = useRef<THREE.Mesh>(null);
  const doneAt = useRef<number | null>(null);
  const material = useMemo(() => signalRedMaterial(clip.identity), []);

  const { geometry, position } = useMemo(() => {
    const { width: W, height: H } = size;
    const k = (2 * (CAMERA_Z - Z) * Math.tan((CAMERA_FOV * Math.PI) / 360)) / H;
    const thick = 0.25 * H * Math.cos(ANGLE);
    const length = (1.5 * W) / Math.cos(ANGLE);
    const g = new THREE.PlaneGeometry(length * k, thick * k);
    g.translate((length * k) / 2, 0, 0); // origin at the left end → scale.x reveals from the left
    const startX = -0.12 * W;
    const startY = H + 0.12 * W * Math.tan(ANGLE);
    return {
      geometry: g,
      position: new THREE.Vector3((startX - W / 2) * k, (H / 2 - startY) * k, Z),
    };
  }, [size]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    if (loaderState === "done" && doneAt.current === null) doneAt.current = clock.elapsedTime;
    const t = doneAt.current === null ? 0 : (clock.elapsedTime - doneAt.current - 0.15) / 1.1;
    mesh.current.scale.x = Math.max(0.0001, easeOutExpo(Math.min(1, Math.max(0, t))));
  });

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      material={material}
      position={position}
      rotation={[0, 0, ANGLE]}
    />
  );
}
