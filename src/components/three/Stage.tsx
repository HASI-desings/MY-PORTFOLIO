"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { director, redCutGeometry, subscribe } from "@/lib/director";
import { color } from "@/lib/tokens";
import { tierForced, tierSettings } from "@/lib/tier";
import { usePageVisible } from "@/hooks/useVisibility";
import { useExperience } from "@/store/experience";
import CameraRig, { enterProgress } from "./CameraRig";
import Core from "./Core";
import Dust from "./Dust";
import HasiLetters from "./HasiLetters";
import Lights from "./Lights";
import RedPlane from "./RedPlane";
import SceneErrorBoundary from "./SceneErrorBoundary";
import ToolOrbit from "./ToolOrbit";
import { clip } from "./materials";
import { toolAnchor } from "./anchor";

const ndc = new THREE.Vector3();
const A = new THREE.Vector3();
const B = new THREE.Vector3();
const T = new THREE.Vector3();
const n = new THREE.Vector3();

/** A clipping plane through the camera that projects onto the screen line y = c − tan·x. */
function planeFromScreenLine(
  plane: THREE.Plane,
  camera: THREE.Camera,
  W: number,
  H: number,
  c: number,
  tan: number,
  keepAbove: boolean,
) {
  const toWorld = (out: THREE.Vector3, x: number, y: number) =>
    out.copy(ndc.set((x / W) * 2 - 1, -(y / H) * 2 + 1, 0.5)).unproject(camera);
  toWorld(A, 0, c);
  toWorld(B, W, c - tan * W);
  n.subVectors(A, camera.position).cross(B.clone().sub(camera.position)).normalize();
  plane.setFromNormalAndCoplanarPoint(n, camera.position);
  toWorld(T, W / 2, c - (tan * W) / 2 - 40); // a point 40 px above the line
  const above = plane.distanceToPoint(T) > 0;
  if (above !== keepAbove) plane.negate();
}

/** THE RED CUT in 3D: the same diagonal that clips the DOM layers clips the 3D scenes. */
function CutPlanes() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useFrame(() => {
    const tr = director.transition;
    const [idPlane] = clip.identity;
    const [tkPlane] = clip.toolkit;
    if (tr?.kind === "redcut" && tr.from === "identity" && tr.to === "toolkit") {
      const g = redCutGeometry({ vw: size.width, vh: size.height }, tr.p);
      planeFromScreenLine(idPlane, camera, size.width, size.height, g.lead, g.tan, true);
      planeFromScreenLine(tkPlane, camera, size.width, size.height, g.trail, g.tan, false);
    } else {
      idPlane.set(n.set(0, 1, 0), 1e5);
      tkPlane.set(n.set(0, 1, 0), 1e5);
    }
  }, -1);
  return null;
}

/** Which 3D scenes are on screen — off-screen groups are hidden to save GPU. */
function SceneSwitch() {
  const identity = useRef<THREE.Group>(null);
  const toolkit = useRef<THREE.Group>(null);
  const width = useThree((s) => s.size.width);
  useFrame(() => {
    const intoToolkit = enterProgress("toolkit");
    const intoCreate = enterProgress("create");
    if (identity.current) identity.current.visible = intoToolkit < 1;
    // Below 640 px the toolkit is the 2.5D DOM version (Security.md §5).
    if (toolkit.current)
      toolkit.current.visible = width >= 640 && intoToolkit > 0 && intoCreate < 1;
  });
  return (
    <>
      <group ref={identity}>
        <Suspense fallback={null}>
          <HasiLetters />
        </Suspense>
        <RedPlane />
      </group>
      <group ref={toolkit} visible={false}>
        <Core />
        <ToolOrbit />
      </group>
    </>
  );
}

/** Procedural studio reflections for the metal tiles — no external HDR (CSP stays 'self'). */
function Environment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.32;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
      room.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const m = mesh.material as THREE.Material | undefined;
        m?.dispose?.();
      });
    };
  }, [gl, scene]);
  return null;
}

/** Average FPS < 40 for 2 s → one tier down, once per session (Design.md §11). */
function FpsGuard() {
  const acc = useRef({ t: 0, frames: 0 });
  useFrame((_, delta) => {
    const s = useExperience.getState();
    if (s.loaderState !== "done" || s.tierStepped || tierForced()) return;
    acc.current.t += delta;
    acc.current.frames += 1;
    if (acc.current.t >= 2) {
      const fps = acc.current.frames / acc.current.t;
      acc.current = { t: 0, frames: 0 };
      if (fps < 40) s.stepDownTier();
    }
  });
  return null;
}

/** Keeps the hovered tool's DOM label pinned to its projected 3D position. */
function LabelAnchor() {
  useFrame(() => {
    const el = document.getElementById("tool-label");
    const anchor = toolAnchor;
    if (!el) return;
    if (!anchor.visible) {
      el.style.opacity = "0";
      return;
    }
    el.style.opacity = "1";
    el.style.transform = `translate3d(${anchor.x.toFixed(1)}px, ${anchor.y.toFixed(1)}px, 0)`;
  });
  return null;
}

/**
 * The single persistent canvas behind every scene (Design.md §7). It renders only while a
 * 3D scene is on screen and the tab is visible; off-screen it does nothing at all.
 */
export default function Stage() {
  const tier = useExperience((s) => s.tier);
  // Behind the opaque loader one frame is enough (it compiles the shaders); full-rate
  // rendering starts with the handoff.
  const behindLoader = useExperience((s) => s.loaderState === "loading");
  const setWebglLost = useExperience((s) => s.setWebglLost);
  const visible = usePageVisible();
  const [onScreen, setOnScreen] = useState(true);
  const settings = tierSettings[tier];

  useEffect(
    () =>
      subscribe(() => {
        const next = enterProgress("create") < 1;
        setOnScreen((prev) => (prev === next ? prev : next));
      }),
    [],
  );

  return (
    <SceneErrorBoundary onError={() => setWebglLost(true)}>
      <Canvas
        className="!absolute inset-0"
        aria-hidden="true"
        dpr={[1, settings.dpr]}
        frameloop={!visible || !onScreen ? "never" : behindLoader ? "demand" : "always"}
        gl={{
          antialias: tier === "high",
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
        }}
        camera={{ fov: 30, position: [0, 0, 14], near: 0.1, far: 80 }}
        eventSource={
          typeof document !== "undefined"
            ? (document.getElementById("main") ?? undefined)
            : undefined
        }
        eventPrefix="client"
        onPointerMissed={() => useExperience.getState().setHoveredTool(null)}
        onCreated={({ gl, scene }) => {
          gl.localClippingEnabled = true;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          scene.background = new THREE.Color(color.obsidian);
          scene.fog = new THREE.FogExp2(color.obsidian, tier === "high" ? 0.038 : 0.03);
          const canvas = gl.domElement;
          canvas.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setWebglLost(true);
          });
          canvas.addEventListener("webglcontextrestored", () => setWebglLost(false), {
            once: true,
          });
        }}
      >
        <Environment />
        <CameraRig />
        <CutPlanes />
        <Lights />
        <Dust count={settings.dust} />
        <SceneSwitch />
        <FpsGuard />
        <LabelAnchor />
      </Canvas>
    </SceneErrorBoundary>
  );
}
