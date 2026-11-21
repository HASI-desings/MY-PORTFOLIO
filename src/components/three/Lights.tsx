"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { director } from "@/lib/director";
import { color } from "@/lib/tokens";
import { range } from "@/lib/utils";

/**
 * Key: cool, soft, from top-left (ice). Rim: thin red from behind-right. Ambient: barely
 * there (Design.md §8). In Scene 01 the key light rakes across the letters as you scroll.
 */
export default function Lights() {
  const key = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (!key.current) return;
    const p = range(director.progress.identity ?? 0, 0.35, 1);
    key.current.position.set(-7 + 12 * p, 8 - 2 * p, 9);
  });

  return (
    <>
      <ambientLight intensity={0.18} color={color.ice} />
      <directionalLight ref={key} position={[-7, 8, 9]} intensity={2.1} color="#e8eef5" />
      <directionalLight position={[8, 1.5, -7]} intensity={5.5} color={color.red} />
      <pointLight position={[5, -2, -3]} intensity={18} distance={14} decay={2} color={color.red} />
    </>
  );
}
