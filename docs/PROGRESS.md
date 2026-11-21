# Progress

| Phase | Name | Status | Notes |
|---|---|---|---|
| 0 | Wipe & prepare | ✅ Done | Only `_brief/` (8 spec files + `Video.mp4` + `ME.png`) remains. Pushed. |
| 1 | Study & confirm | ✅ Done · ⛔ Stop 1 approved | `docs/REFERENCE_ANALYSIS.md`, `docs/DECISIONS.md`, `scripts/extract-reference-frames.sh` |
| 2 | Project setup | ✅ Done | Next.js 16.4.6, React 19.3.1, full tree stubbed; build/lint/typecheck pass |
| 3 | Assets pipeline | ✅ Done | Owner waived the remaining stops: build straight through |
| 4 | Design system & tokens | ✅ Done | `/styleguide` verified (removed in Phase 12) |
| 5 | Core engine | ✅ Done | director, Lenis/ScrollTrigger, RED CUT + 3D clip planes, depth push, loader, chrome, tiers |
| 6 | Scene 01 · Identity | ✅ Done | stops waived by owner |
| 7 | Scene 02 · Toolkit | ✅ Done | 3D + 2.5D |
| 8 | Scene 03 · What I Create | ✅ Done | six live visuals |
| 9 | Scene 04 · Projects | ✅ Done | hidden while empty (D-012); verified with a fixture |
| 10 | Scene 05 · Philosophy | ✅ Done | |
| 11 | Scene 06 · Final | ✅ Done | studio backdrop from ME.png (D-014) |
| 12 | Responsiveness, fallbacks, resilience | ✅ Done | 9 viewports, no-JS, reduced motion, lite, offline, slow network |
| 13 | Performance | ✅ Done (one target not met here) | initial JS 235 KB, CLS ≤ 0.009; Lighthouse Perf limited by software GL — see QA_REPORT §7 |
| 14 | QA & handover | ✅ Done | docs/QA_REPORT.md, README |

## Log

### Phase 0
- Fast-forwarded the working branch to `main` (which already had the old files deleted).
- Added `_brief/` with the 8 spec files and both assets. `ME.png` = lossless PNG of the chat-attached image (pixel-identical).
- Commit: `chore: remove previous portfolio, keep only _brief`.

### Phase 1
- Read all 8 spec files and the build playbooks (design system, motion, QA, anti-generic checklist).
- Studied `Video.mp4`: 69 frames at 2 fps, 9 contact sheets, 14 monitor-only crops; watched at full speed for rhythm. Frames stay in the session scratchpad, not committed.
- Verified spec facts against live sources: Simple Icons slugs (2 missing), network access for Phase 3.
- Stop 1 answers: Design.md wins on red for its red screens · push to `main` · the featured toolkit object is removed from site and repo · no projects displayed for now (DECISIONS D-001, D-003, D-004, D-012).

### Phase 2
- Scaffolded with `create-next-app@16.4.6` (TypeScript, App Router, Tailwind v4, ESLint, `src/`, `@/*`), moved into the repo.
- Installed (exact versions): next 16.4.6, react/react-dom 19.3.1, three 0.187.0, @react-three/fiber 9.8.2, @react-three/drei 10.7.9, gsap 3.15.1, lenis 1.3.27, framer-motion 14.14.0, zustand 5.1.0, simple-icons 16.38.0, lucide-react 1.77.0. Dev: typescript 5.9.3, eslint 9 + eslint-config-next, tailwindcss 4.3.5, prettier 3.10.1, playwright 1.63.0, @types/three.
- `npm audit`: 0 vulnerabilities.
- Full Structure.md tree created (77 stubs that render nothing) + real `types/content.ts`, empty `content/projects.ts`, layout, page, loading, 404, error, global-error, manifest, robots, `/projects/[slug]`.
- `next.config.ts`: Security.md §2 headers (CSP production-only), `poweredByHeader: false`, AVIF/WebP images.
- `.gitignore`, `.nvmrc` (24), `.prettierrc`, CI workflow (lint → typecheck → build, no deploy), LICENSE, README.
- **Verified:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ (5 static routes) · `next start` serves all 7 security headers, no `X-Powered-By` · unknown `/projects/*` → 404 · Prettier clean.

### Phase 3
- Owner instruction: work through every phase without approval stops and push to `main`.
- Portrait: difference-matte cutout → `public/me/me-1040.{webp,png}`, `me-640.webp`, `me-400.webp`, `me-placeholder.txt` (373 KB total). Backdrop falloff measured for Scene 06 (D-014, D-016).
- 3D typeface `public/fonts/archivo-black.typeface.json` (14 KB) + OG font subsets (D-017). Verified in three.js: "HASI" → 4,380-vertex extruded geometry.
- `public/textures/grain.png` (31 KB), `public/favicon.svg` (Archivo H, ice on obsidian, red corner cut).
- `scripts/capture-screenshots.mjs` ready for future LIVE projects (verified: reports nothing to capture).

### Phase 4
- Tokens in `globals.css` (palette, measured studio backdrop, fluid type, layout, motion, z-map, contrast rules) mirrored in `lib/tokens.ts`; Tailwind v4 `@theme` with Design.md §13 breakpoints + `short` / `fine` variants.
- Fonts via `next/font/google`: Archivo (variable weight + width), Geist, Geist Mono — self-hosted, swap.
- Experience modes chosen before first paint by an inline script: `cine` (scroll-driven stage) or `static` (reduced motion); no JS → readable stacked page.
- Primitives: `Button` (all §10 states), `Panel` (focus trap, Esc, ×, outside click, back gesture, focus return), `MaskText`, `SplitLetters`, `MonoLabel`, `Toast`.
- Content files filled from App.md / Design.md; shared store `store/experience.ts`.
- **Verified:** typecheck ✓ lint ✓ build ✓; `/styleguide` screenshot at 1440 px — tokens, type roles and every button state render; no console errors.

### Phases 5–11 (built straight through at the owner's request)
- Engine: `lib/director.ts` master timeline, Lenis (desktop) + ScrollTrigger, THE RED CUT as clip-paths on scene layers with matching 3D clipping planes, depth push, layer visibility/`inert`, scroll restoration, progress-preserving resize.
- Loader with real asset progress (fonts, scroll engine, three, R3F, stage, typeface, grain), 1.2 s minimum, 6 s / 12 s notices, shared-element handoff onto the Scene 01 letters.
- Scenes 01–06 as specified (see QA_REPORT for evidence); Scene 04 hidden while `projects.ts` is empty.

### Phase 12
- Branded 404 / error / global-error; OG image (generated, Archivo), sitemap, robots, manifest; `/styleguide` removed.
- Fixed during testing: no-JS blank page (D-020), touch snap jump (D-023), static reveals (D-024), slow-network hydration (D-025), short-screen Scene 01, contrast (D-026), focus handling for skip link / contact / panel.

### Phase 13
- Initial JS 297 → 235 KB gzip (D-022); three pinned to 0.182 (D-021); canvas idles behind the loader; heap stable over 3 full scrolls.

### Phase 14
- `docs/QA_REPORT.md` (real results only), README (run, edit content, add a project, scripts, deploy). Not deployed.
