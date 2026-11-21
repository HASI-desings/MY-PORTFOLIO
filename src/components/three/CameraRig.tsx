"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { director } from "@/lib/director";
import { clamp, easeInOutCubic, range } from "@/lib/utils";
import { pointer, usePointer } from "@/hooks/usePointer";
import type { SceneId } from "@/store/experience";

export const CAMERA_Z = 14;
export const CAMERA_FOV = 30;
const DEG = Math.PI / 180;

/** 0 before the transition into `id`, 1 after it, linear in between. */
export function enterProgress(id: SceneId) {
  const seg = director.segments.find((s) => s.kind !== "scene" && s.scene === id);
  if (!seg) return 0;
  return clamp((director.time - seg.start) / seg.length);
}

const pos = new THREE.Vector3();
const target = new THREE.Vector3();
const a = new THREE.Vector3();
const b = new THREE.Vector3();
const ta = new THREE.Vector3();
const tb = new THREE.Vector3();
const forward = new THREE.Vector3();
const offset = new THREE.Vector3();
const spherical = new THREE.Spherical();

/**
 * Scroll + pointer driven camera (Design.md §9):
 * - Scene 01, 35–100 %: slow dolly left and ~8° tilt up while the key light rakes.
 * - THE RED CUT: blends to the toolkit framing.
 * - Scene 02, 60–90 %: orbit ~35° around the Core.
 * - Depth push out of Scene 02: dolly forward through the tools.
 * - Pointer: camera orbits ±3° (lerp 0.06). Never more than 8° of tilt, never fast.
 */
export default function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const look = useRef({ x: 0, y: 0 });
  usePointer();

  useEffect(() => {
    camera.fov = CAMERA_FOV;
    camera.near = 0.1;
    camera.far = 80;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useFrame(() => {
    // Scene 01 pose
    const e1 = easeInOutCubic(range(director.progress.identity ?? 0, 0.35, 1));
    a.set(-1.4 * e1, 0, CAMERA_Z - 1.2 * e1);
    ta.set(-0.8 * e1, 1.9 * e1, 0);

    // Scene 02 pose (orbit around the Core)
    const angle = easeInOutCubic(range(director.progress.toolkit ?? 0, 0.6, 0.9)) * 35 * DEG;
    b.set(Math.sin(angle) * CAMERA_Z, 0.35, Math.cos(angle) * CAMERA_Z);
    tb.set(0, 0, 0);

    const w = easeInOutCubic(enterProgress("toolkit"));
    pos.copy(a).lerp(b, w);
    target.copy(ta).lerp(tb, w);

    // Depth push: travel forward through the outgoing toolkit.
    const tr = director.transition;
    const out = tr && tr.kind === "depth" && tr.from === "toolkit" ? tr.p : enterProgress("create");
    if (out > 0) {
      forward.subVectors(target, pos).normalize();
      pos.addScaledVector(forward, 6 * easeInOutCubic(out));
    }

    // Pointer parallax: ±3° orbit around the look target.
    const px = pointer.active ? pointer.x : 0;
    const py = pointer.active ? pointer.y : 0;
    look.current.x += (px - look.current.x) * 0.06;
    look.current.y += (py - look.current.y) * 0.06;
    offset.subVectors(pos, target);
    spherical.setFromVector3(offset);
    spherical.theta += look.current.x * 3 * DEG;
    spherical.phi -= look.current.y * 2 * DEG;
    offset.setFromSpherical(spherical);

    camera.position.copy(target).add(offset);
    camera.lookAt(target);
  });

  return null;
}
