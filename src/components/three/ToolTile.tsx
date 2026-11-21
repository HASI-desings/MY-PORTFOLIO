"use client";

import { RoundedBox } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { iconFor, monogramLines } from "@/lib/icons";
import { cssFontFamily } from "@/lib/preload";
import type { Tool } from "@/types/content";
import { brushedMetalMaterial, clip } from "./materials";

export const TILE = 0.9;
const TEX = 256;

/** White mark on transparent canvas; tinted ice (rest) or brand colour (hover) by the material. */
function drawMark(tool: Tool) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = TEX;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  const icon = iconFor(tool.simpleIconSlug);
  if (icon) {
    const pad = 52;
    const s = (TEX - pad * 2) / 24;
    ctx.translate(pad, pad);
    ctx.scale(s, s);
    ctx.fill(new Path2D(icon.path));
  } else {
    // Archivo monogram tile — never an imitation logo (Design.md §12).
    const lines = monogramLines(tool.name);
    const family = cssFontFamily("--font-archivo");
    const fontSize = lines.length > 1 ? 70 : 84;
    ctx.font = `900 ${fontSize}px ${family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lh = fontSize * 0.92;
    lines.forEach((line, i) =>
      ctx.fillText(line, TEX / 2, TEX / 2 + (i - (lines.length - 1) / 2) * lh),
    );
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export interface TileHandles {
  group: THREE.Group;
  body: THREE.MeshStandardMaterial;
  mark: THREE.MeshBasicMaterial;
  brand: THREE.Color;
}

interface ToolTileProps {
  tool: Tool;
  onOver: (e: ThreeEvent<PointerEvent>) => void;
  onOut: () => void;
  onTap: (e: ThreeEvent<MouseEvent>) => void;
  register: (h: TileHandles | null) => void;
}

/** One tool: a thin rounded tile of brushed dark metal with its mark embossed in ice. */
const ToolTile = forwardRef<THREE.Group, ToolTileProps>(function ToolTile(
  { tool, onOver, onOut, onTap, register },
  ref,
) {
  const { body, mark, texture, brand } = useMemo(() => {
    const texture = drawMark(tool);
    const body = brushedMetalMaterial(clip.toolkit);
    const mark = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      toneMapped: false,
      color: "#DFE5EB",
      clippingPlanes: clip.toolkit,
      depthWrite: false,
    });
    const brand = new THREE.Color(iconFor(tool.simpleIconSlug)?.hex ?? "#DFE5EB");
    return { body, mark, texture, brand };
  }, [tool]);

  useEffect(
    () => () => {
      body.dispose();
      mark.dispose();
      texture.dispose();
    },
    [body, mark, texture],
  );

  return (
    <group
      ref={(g) => {
        if (typeof ref === "function") ref(g);
        else if (ref) ref.current = g;
        register(g ? { group: g, body, mark, brand } : null);
      }}
    >
      <RoundedBox
        args={[TILE, TILE, 0.12]}
        radius={0.05}
        smoothness={3}
        material={body}
        onPointerOver={onOver}
        onPointerOut={onOut}
        onClick={onTap}
      />
      <mesh position={[0, 0, 0.062]} material={mark}>
        <planeGeometry args={[TILE * 0.78, TILE * 0.78]} />
      </mesh>
    </group>
  );
});

export default ToolTile;
