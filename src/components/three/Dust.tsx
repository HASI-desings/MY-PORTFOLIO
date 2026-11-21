"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { color } from "@/lib/tokens";
import { seeded } from "@/lib/utils";

const BOX = new THREE.Vector3(26, 16, 18);

/**
 * Dust motes drifting slowly through the key light (Design.md §8). Motion is computed on
 * the GPU from a time uniform, so the CPU cost is zero per frame.
 */
export default function Dust({ count }: { count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const rand = seeded(11);
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos.set([(rand() - 0.5) * BOX.x, (rand() - 0.5) * BOX.y, (rand() - 0.5) * BOX.z - 3], i * 3);
      vel.set([(rand() - 0.5) * 0.12, 0.03 + rand() * 0.08, (rand() - 0.5) * 0.05], i * 3);
      size[i] = 0.6 + rand() * 1.8;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("velocity", new THREE.BufferAttribute(vel, 3));
    g.setAttribute("size", new THREE.BufferAttribute(size, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBox: { value: BOX },
      uColor: { value: new THREE.Color(color.ice) },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    uniforms.uTime.value += Math.min(delta, 0.05);
    uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });

  if (count === 0) return null;

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={
          /* glsl */ `
          attribute vec3 velocity;
          attribute float size;
          uniform float uTime;
          uniform vec3 uBox;
          uniform float uPixelRatio;
          varying float vFade;
          void main() {
            vec3 p = position + velocity * uTime;
            p = mod(p + uBox * 0.5, uBox) - uBox * 0.5;
            p.z -= 3.0;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = size * uPixelRatio * (9.0 / -mv.z);
            vFade = smoothstep(26.0, 6.0, -mv.z) * (0.55 + 0.45 * sin(uTime * 0.6 + position.x));
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          uniform vec3 uColor;
          varying float vFade;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d) * 0.42 * vFade;
            gl_FragColor = vec4(uColor, a);
          }
        `
        }
      />
    </points>
  );
}
