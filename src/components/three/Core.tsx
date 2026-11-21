"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { director } from "@/lib/director";
import { color } from "@/lib/tokens";
import { easeOutExpo, range } from "@/lib/utils";
import { clip, graphiteMaterial } from "./materials";

const W = 1.1;
const H = W * 3.2; // 1 : 3.2 (Design.md §9)

/**
 * The Core: a slowly turning graphite monolith with red edge light — an abstract stand-in
 * for the creator, in the same obsidian + red-rim language as the final portrait.
 */
export default function Core() {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);

  const { body, edges, bodyMat, edgeMat } = useMemo(() => {
    const body = new THREE.BoxGeometry(W, H, W);
    const edges = new THREE.EdgesGeometry(body);
    const bodyMat = graphiteMaterial(clip.toolkit);
    const edgeMat = new THREE.LineBasicMaterial({
      color: color.red,
      toneMapped: false,
      transparent: true,
      opacity: 0.9,
      clippingPlanes: clip.toolkit,
    });
    return { body, edges, bodyMat, edgeMat };
  }, []);

  useEffect(
    () => () => {
      body.dispose();
      edges.dispose();
      bodyMat.dispose();
      edgeMat.dispose();
    },
    [body, edges, bodyMat, edgeMat],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    spin.current += 0.08 * Math.min(delta, 0.05);
    const rise = easeOutExpo(range(director.progress.toolkit ?? 0, 0, 0.15));
    group.current.position.y = -7.5 + (7.5 - 0.15) * rise;
    group.current.rotation.y = spin.current;
  });

  return (
    <group ref={group} position={[0, -7.5, 0]}>
      <mesh geometry={body} material={bodyMat} />
      <lineSegments geometry={edges} material={edgeMat} scale={1.002} />
    </group>
  );
}
