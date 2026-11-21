"use client";

import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { FontLoader, type FontData } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { site } from "@/content/site";
import { getTypeface } from "@/lib/preload";
import { useExperience } from "@/store/experience";
import { CAMERA_FOV, CAMERA_Z } from "./CameraRig";
import { clip, iceFrontMaterial, matteObsidianMaterial } from "./materials";

const DEPTH = 0.172; // ≈ 0.25 × cap height (0.688 em) — Design.md §9
const BEVEL = 0.01;

interface SlotMetrics {
  lefts: number[];
  baseline: number;
  fontSize: number;
}

/** Reads the DOM letters in Scene 01 — the 3D letters are laid exactly over them. */
function measureSlot(): SlotMetrics | null {
  const slot = document.querySelector<HTMLElement>("[data-hasi-slot]");
  const base = slot?.querySelector<HTMLElement>("[data-baseline]");
  if (!slot || !base) return null;
  const lefts = Array.from(slot.querySelectorAll<HTMLElement>("[data-letter]")).map(
    (el) => el.getBoundingClientRect().left,
  );
  return {
    lefts,
    baseline: base.getBoundingClientRect().top,
    fontSize: parseFloat(getComputedStyle(slot).fontSize),
  };
}

let fontPromise: Promise<FontData> | null = null;
const loadFont = () => (fontPromise ??= getTypeface().then((json) => json as FontData));

/**
 * The 3D HASI (Design.md §9 Scene 01): extruded Archivo 900/125, ice-lit fronts, matte
 * obsidian sides catching a thin red rim. Each letter sits exactly on its DOM twin, so the
 * loader → Scene 01 handoff is seamless. Hover a letter → its rim turns full red.
 */
export default function HasiLetters() {
  const data = use(loadFont());
  const font = useMemo(() => new FontLoader().parse(data), [data]);
  const size = useThree((s) => s.size);
  const loaderState = useExperience((s) => s.loaderState);
  const setLettersReady = useExperience((s) => s.setLettersReady);
  const [metrics, setMetrics] = useState<SlotMetrics | null>(null);
  const hovered = useRef(-1);
  const fade = useRef(0);
  const announced = useRef(false);

  const letters = useMemo(() => {
    return Array.from(site.wordmark).map((ch) => {
      const geometry = new TextGeometry(ch, {
        font,
        size: 1,
        depth: DEPTH,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: BEVEL,
        bevelSize: 0.005,
        bevelSegments: 2,
      });
      geometry.translate(0, 0, -(DEPTH + BEVEL)); // front face on the z = 0 mapping plane
      const front = iceFrontMaterial(clip.identity);
      const side = matteObsidianMaterial(clip.identity);
      return { geometry, front, side, rim: 0 };
    });
  }, [font]);

  useEffect(
    () => () =>
      letters.forEach((l) => {
        l.geometry.dispose();
        l.front.dispose();
        l.side.dispose();
      }),
    [letters],
  );

  // Re-measure whenever the canvas changes size (fonts are loaded before the canvas mounts).
  useEffect(() => {
    const id = requestAnimationFrame(() => setMetrics(measureSlot()));
    return () => cancelAnimationFrame(id);
  }, [size.width, size.height]);

  useEffect(() => () => setLettersReady(false), [setLettersReady]);

  const placement = useMemo(() => {
    if (!metrics) return null;
    const k = (2 * CAMERA_Z * Math.tan((CAMERA_FOV * Math.PI) / 360)) / size.height; // world units per px at z = 0
    const scale = metrics.fontSize * k;
    return {
      scale,
      xs: metrics.lefts.map((left) => (left - size.width / 2) * k),
      y: (size.height / 2 - metrics.baseline) * k,
    };
  }, [metrics, size.width, size.height]);

  useFrame((_, delta) => {
    const target = loaderState === "done" ? 1 : 0;
    fade.current = Math.min(
      1,
      Math.max(0, fade.current + (target - fade.current) * Math.min(1, delta * 6)),
    );
    if (target === 1 && fade.current > 0.98 && !announced.current) {
      announced.current = true;
      setLettersReady(true);
    }
    letters.forEach((l, i) => {
      l.rim += ((hovered.current === i ? 1 : 0) - l.rim) * Math.min(1, delta * 9);
      l.side.emissiveIntensity = 0.04 + l.rim * 1.3;
      l.front.opacity = fade.current;
      l.side.opacity = fade.current;
      l.front.depthWrite = l.side.depthWrite = fade.current > 0.5;
    });
  });

  if (!placement) return null;

  const over = (i: number) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hovered.current = i;
  };
  const out = (i: number) => () => {
    if (hovered.current === i) hovered.current = -1;
  };

  return (
    <group>
      {letters.map((l, i) => (
        <mesh
          key={i}
          geometry={l.geometry}
          material={[l.front, l.side]}
          position={[placement.xs[i] ?? 0, placement.y, 0]}
          scale={placement.scale}
          onPointerOver={over(i)}
          onPointerOut={out(i)}
        />
      ))}
    </group>
  );
}
