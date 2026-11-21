import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Rules.md §4.6 — no console output in committed code.
      "no-console": "error",
    },
  },
  {
    // three.js / React Three Fiber work by mutating the scene graph, cameras, materials and
    // uniforms every frame — that is the library's design, not a React state bug.
    files: ["src/components/three/**"],
    rules: { "react-hooks/immutability": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "_brief/**", "docs/**"]),
]);

export default eslintConfig;
