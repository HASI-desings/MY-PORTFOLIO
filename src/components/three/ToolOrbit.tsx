"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useMemo, useRef } from "react";
import * as THREE from "three";
import { toolkit } from "@/content/toolkit";
import { director } from "@/lib/director";
import { easeOutExpo, range, seeded } from "@/lib/utils";
import { useExperience } from "@/store/experience";
import { toolAnchor } from "./anchor";
import ToolTile, { TILE, type TileHandles } from "./ToolTile";

/**
 * Three asymmetric depth rings around the Core — never a grid, never a perfect circle
 * (Design.md §9). Positions are hand-placed for a 16:10 frame and compressed horizontally
 * for narrower aspects. The top-left stays clear for the scene title.
 */
const SLOTS: [number, number, number][] = [
  // near ring
  [-3.3, -1.7, 2.4],
  [2.5, -2.05, 2.6],
  [3.9, 0.85, 1.8],
  [-1.95, 0.55, 3.0],
  [3.0, 2.2, 1.0],
  // mid ring
  [-4.7, 0.15, 0],
  [4.95, -1.25, -0.3],
  [-2.6, -2.6, 0.2],
  [2.35, 0.95, -0.6],
  [-2.1, -0.9, -1.2],
  [5.3, 2.3, 0.4],
  // far ring
  [-5.9, -2.45, -3.5],
  [-3.7, 1.75, -4.0],
  [0.95, -3.05, -3.2],
  [1.6, 2.35, -5.2],
  [6.6, -0.45, -4.5],
  [5.2, -2.9, -2.0],
];

const ENTRY_START = 0.15;
const ENTRY_STEP = 0.02; // 140 ms stagger, in scroll terms
const ENTRY_LEN = 0.12;

const tmp = new THREE.Vector3();
const toCam = new THREE.Vector3();
const faceCam = new THREE.Quaternion();
const baseQ = new THREE.Quaternion();
const euler = new THREE.Euler();
const ice = new THREE.Color("#DFE5EB");

export default function ToolOrbit() {
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera);
  const setHoveredTool = useExperience((s) => s.setHoveredTool);
  const handles = useRef<(TileHandles | null)[]>([]);
  const hoverMix = useRef<number[]>(toolkit.map(() => 0));
  const dimMix = useRef(0);

  const layout = useMemo(() => {
    const aspect = size.width / size.height;
    const sx = Math.min(1.2, Math.max(0.6, aspect / 1.6));
    const sy = aspect < 1 ? 1.25 : 1;
    const rand = seeded(42);
    return SLOTS.slice(0, toolkit.length).map(([x, y, z]) => ({
      pos: new THREE.Vector3(x * sx, y * sy, z),
      yaw: (rand() - 0.5) * 0.7,
      pitch: (rand() - 0.5) * 0.3,
      phase: rand() * Math.PI * 2,
      speed: 0.5 + rand() * 0.5,
    }));
  }, [size.width, size.height]);

  const register = useCallback(
    (i: number) => (h: TileHandles | null) => {
      handles.current[i] = h;
    },
    [],
  );

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const progress = director.progress.toolkit ?? 0;
    const hovered = useExperience.getState().hoveredTool;
    const k = Math.min(1, delta * 7); // ≈ 600 ms settle (--dur-med)
    dimMix.current += ((hovered ? 1 : 0) - dimMix.current) * k;
    let anchorSet = false;

    toolkit.forEach((tool, i) => {
      const h = handles.current[i];
      const slot = layout[i];
      if (!h || !slot) return;
      const isHovered = hovered === tool.id;
      hoverMix.current[i] += ((isHovered ? 1 : 0) - hoverMix.current[i]) * k;
      const hv = hoverMix.current[i];

      // Entry: from beyond the far plane, one by one, landing with --ease-out.
      const start = ENTRY_START + i * ENTRY_STEP;
      const e = easeOutExpo(range(progress, start, start + ENTRY_LEN));
      tmp.set(slot.pos.x * 0.15, slot.pos.y * 0.15, -42).lerp(slot.pos, e);

      // Idle float (sine, amplitude 0.04) and a slow yaw.
      tmp.y += Math.sin(t * slot.speed + slot.phase) * 0.04 * e;

      // Lift toward the camera on hover.
      toCam.subVectors(camera.position, tmp).normalize();
      tmp.addScaledVector(toCam, 0.35 * hv);
      h.group.position.copy(tmp);
      h.group.scale.setScalar((0.6 + 0.4 * e) * (1 + 0.15 * hv));

      euler.set(
        slot.pitch + Math.sin(t * 0.3 + slot.phase) * 0.05,
        slot.yaw + Math.sin(t * 0.2 + slot.phase) * 0.12,
        0,
      );
      baseQ.setFromEuler(euler);
      faceCam.copy(camera.quaternion);
      h.group.quaternion.copy(baseQ).slerp(faceCam, hv);

      // Brand colour on hover; everyone else dims to 40 %.
      h.mark.color.copy(ice).lerp(h.brand, hv);
      const dim = 1 - 0.6 * dimMix.current * (1 - hv);
      h.body.opacity = dim * e;
      h.mark.opacity = dim * e;

      if (isHovered && e > 0.5) {
        tmp.copy(h.group.position).project(camera);
        const px = (tmp.x * 0.5 + 0.5) * size.width;
        const py = (-tmp.y * 0.5 + 0.5) * size.height;
        const half =
          ((TILE * h.group.scale.x) / 2) *
          (size.height /
            (2 * camera.position.distanceTo(h.group.position) * Math.tan((30 * Math.PI) / 360)));
        const right = px < size.width * 0.62;
        toolAnchor.x = right ? px + half + 20 : px - half - 20 - 300;
        toolAnchor.y = py - 40;
        toolAnchor.visible = true;
        anchorSet = true;
      }
    });
    if (!anchorSet) toolAnchor.visible = false;
  });

  return (
    <group>
      {toolkit.map((tool, i) => (
        <ToolTile
          key={tool.id}
          tool={tool}
          register={register(i)}
          onOver={(e) => {
            e.stopPropagation();
            setHoveredTool(tool.id);
          }}
          onOut={() => {
            if (useExperience.getState().hoveredTool === tool.id) setHoveredTool(null);
          }}
          onTap={(e) => {
            e.stopPropagation();
            setHoveredTool(tool.id);
          }}
        />
      ))}
    </group>
  );
}
