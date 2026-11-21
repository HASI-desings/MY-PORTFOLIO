import * as THREE from "three";
import { color } from "@/lib/tokens";

/**
 * Shared material language (Design.md §8): matte obsidian, brushed metal, ice-lit fronts.
 * Clipping planes let THE RED CUT slice each 3D scene along the same screen diagonal as
 * the DOM layers (see CutPlanes in Stage.tsx).
 */
export const clip = {
  identity: [new THREE.Plane(new THREE.Vector3(0, 1, 0), 1e5)],
  toolkit: [new THREE.Plane(new THREE.Vector3(0, 1, 0), 1e5)],
};

export const ice = new THREE.Color(color.ice);
export const red = new THREE.Color(color.red);
export const obsidian = new THREE.Color(color.obsidian);

/** Front faces of the HASI letters: lit ice that reads light against the dark room. */
export function iceFrontMaterial(planes: THREE.Plane[]) {
  // Not tone-mapped: the faces must read as true ice, with the raking key light on top.
  return new THREE.MeshStandardMaterial({
    color: ice,
    emissive: ice,
    emissiveIntensity: 0.58,
    roughness: 0.7,
    metalness: 0.05,
    clippingPlanes: planes,
    transparent: true,
    toneMapped: false,
  });
}

/** Matte obsidian (roughness 0.85, metalness 0.1) — letter sides, catching the red rim. */
export function matteObsidianMaterial(planes: THREE.Plane[]) {
  return new THREE.MeshStandardMaterial({
    color: color.obsidian800,
    emissive: red,
    emissiveIntensity: 0,
    roughness: 0.85,
    metalness: 0.1,
    clippingPlanes: planes,
    transparent: true,
  });
}

/** Brushed dark metal (roughness 0.35, metalness 0.9) — tool tiles. */
export function brushedMetalMaterial(planes: THREE.Plane[]) {
  return new THREE.MeshStandardMaterial({
    color: color.obsidian700,
    roughness: 0.35,
    metalness: 0.9,
    clippingPlanes: planes,
    transparent: true,
  });
}

/** Graphite monolith body (the Core). */
export function graphiteMaterial(planes: THREE.Plane[]) {
  return new THREE.MeshStandardMaterial({
    color: color.graphite,
    roughness: 0.85,
    metalness: 0.1,
    clippingPlanes: planes,
  });
}

/** Unlit signal red — exact #EF233C, never tone-mapped. */
export function signalRedMaterial(planes: THREE.Plane[]) {
  return new THREE.MeshBasicMaterial({ color: red, toneMapped: false, clippingPlanes: planes });
}
