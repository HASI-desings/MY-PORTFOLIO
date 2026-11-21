# Phases.md — HASI DESIGNS · Build Plan

> Work strictly in order. Each phase ends with: (1) its **Done when** list verified, (2) `docs/PROGRESS.md` updated, (3) one or more commits pushed to `main`. ⛔ marks an **approval stop** — summarize and wait for the owner before continuing.

Map to the full-dev skill: the concept, brand and palette are **already decided** in these files, so full-dev's discovery/concept/inspiration phases are replaced by Phase 1 (study + confirm). Use full-dev's playbooks for design system, motion, build, QA and handover.

---

## Phase 0 — Wipe & prepare the repository
1. Clone `HASI-desings/MY-PORTFOLIO`. Confirm the `_brief/` folder (these files + `assets/Video.mp4` + `assets/ME.png`) is present; if the owner provided them elsewhere, copy them into `_brief/`.
2. Delete **every** tracked file and folder in the repo **except** `.git/` and `_brief/` (old source, configs, lockfiles, public assets, README — all of it).
3. Commit: `chore: remove previous portfolio`. Push.

**Done when:** repo contains only `_brief/`; history preserved; push succeeded.

## Phase 1 — Study & confirm (no code)
1. Read all `_brief` files fully.
2. Study `Video.mp4` per reference.md: extract frames with `scripts/extract-reference-frames.sh` (to `/tmp`, not committed), watch for rhythm, type scale, camera moves, transitions, loading.
3. Write `docs/REFERENCE_ANALYSIS.md`: what is taken (principles) and what is explicitly not copied.
4. List any contradictions or open questions found in the spec.

**Done when:** analysis written. ⛔ **Approval stop 1** — send the owner: the analysis summary + open questions.

## Phase 2 — Project setup
1. `create-next-app` (TypeScript, App Router, Tailwind, ESLint, `src/`, alias `@/*`).
2. Install: `three @react-three/fiber @react-three/drei gsap lenis framer-motion zustand simple-icons lucide-react`; dev: `prettier @next/bundle-analyzer playwright`.
3. Create the full folder tree from Structure.md (empty components with TODO exports are fine).
4. `next.config.ts` security headers (Security.md §2), `.gitignore`, `.nvmrc`, `tsconfig` strict, CI workflow.

**Done when:** `npm run build` passes on a blank page; lint and typecheck clean. Commit `chore: scaffold project`.

## Phase 3 — Assets pipeline
1. **Portrait:** run `scripts/process-portrait.py` on `_brief/assets/ME.png`:
   - If ME.png already has a real alpha channel → keep it.
   - Else remove the light background: primary `rembg` (u2net human-seg model); fallback: luminance/colour-distance key against the light grey backdrop with edge feathering. Preserve fine hair strands.
   - Trim transparent bounds, export `me-1600/1000/600.webp` (quality 82, alpha) + `me-1600.png` + tiny base64 blur placeholder.
   - **Never alter the face, body shape or hair.** No AI upscaling or "enhancement" of the face.
2. **Project screenshots:** run `scripts/capture-screenshots.mjs` (Playwright, 1600×1000, wait for network idle + 1.5s) on the two LIVE URLs → `public/projects/*.webp`. If a URL fails, record it and use a typographic cover — do not fake a screenshot.
3. **Covers:** generate SVG typographic covers for non-live projects (Design.md §9 Scene 04).
4. **Typeface JSON:** convert Archivo (heavy weight) TTF to `public/fonts/archivo-black.typeface.json` (facetype.js-compatible), latin uppercase + digits only.
5. **Grain texture** and **favicon**.

**Done when:** all files from Structure.md `public/` exist, sizes reported (portrait set < 600 KB total). ⛔ **Approval stop 2** — show the processed portrait on obsidian and the screenshots.

## Phase 4 — Design system & tokens
1. CSS variables (colors, type scale, spacing, motion) in `globals.css`; mirror in `lib/tokens.ts`; wire Tailwind theme + breakpoints (Design.md §13).
2. Fonts via `next/font/google` (Archivo variable, Geist, Geist Mono).
3. UI primitives: `Button`, `Panel`, `MaskText`, `SplitLetters`, `MonoLabel`, `Toast` with all states (Design.md §10).
4. Content files (`src/content/*`) filled exactly from App.md + Design.md; types in `src/types/content.ts`.

**Done when:** a temporary `/styleguide` route (deleted before Phase 12) renders all tokens/primitives correctly.

## Phase 5 — Core engine
1. `lib/tier.ts` (WebGL support, GPU hints, deviceMemory, hardwareConcurrency, saveData, reduced motion → `high|mid|low|none`).
2. `lib/lenis.ts` + `lib/gsap.ts` (sync, defaults, refresh on resize/orientation, debounced).
3. `store/experience.ts`, `useScene`, `SceneShell`, scene registration + `SceneIndex`.
4. `<Stage/>` persistent canvas: camera rig, lights, fog, dust, render-on-demand, pause when hidden, DPR cap (high 2, mid 1.5, low 1).
5. `lib/preload.ts` with manifest, real progress, timeouts, retries; `<Loader/>` with the HASI fill and handoff; `<SlowNotice/>`.
6. Global chrome: Wordmark, SceneIndex, TalkLink, InstagramLink, ScrollCue, Cursor, Grain, SkipLink.
7. Transitions: `RedCut`, `DepthPush`.

**Done when:** six placeholder scenes scroll with pins, RED CUT and depth push work, loader hands off, chrome behaves per Design.md §6, 60fps on desktop with empty scenes.

## Phase 6 — Scene 01 · Identity
3D HASI letters, materials, red plane, name block, timeline, pointer parallax, per-letter rim hover, `LettersFallback`.
**Done when:** matches Design.md §9 Scene 01 on desktop + mobile + lite. ⛔ **Approval stop 3 (look test)** — screenshots/recording of loader → Scene 01 at desktop and phone sizes. This sets the visual bar for everything after.

## Phase 7 — Scene 02 · Toolkit
Core, tool tiles (Simple Icons), orbit rings, entry timeline, camera orbit, hover lift + labels, Full Dev object + panel, a11y list, `Toolkit2D`.
**Done when:** all 17 tools + Full Dev present, keyboard and touch work, mobile 2.5D version polished.

## Phase 8 — Scene 03 · What I Create
Chapter system (horizontal desktop / vertical mobile), six live visuals, tags (T3), progress segments.
**Done when:** each visual is distinct, scroll-reversible, light (no visual > 2 ms/frame on desktop), simplified on low tier.

## Phase 9 — Scene 04 · Projects
Surface, plates, status chips, lift interaction, pointer tilt, OPEN PROJECT logic, `ProjectPanel` (`?project=slug`), `/projects/[slug]` static pages.
**Done when:** live links open correctly in new tabs; non-live open the panel; the detail route works directly; adding a project via content only is verified.

## Phase 10 — Scene 05 · Philosophy
Giant type build, light beam, red underline, supporting lines, hover focus.
**Done when:** reads perfectly at every breakpoint (no orphan words, no overflow).

## Phase 11 — Scene 06 · Final
Portrait rise + rim light, statements, red diagonal, CTA (all states, magnetic, sheen), contact reveal, mailto/wa.me with encoding, copy fallback, footer.
**Done when:** Email opens the mail app with subject/body prefilled; WhatsApp opens the chat with the message prefilled — verified on desktop and a mobile viewport.

## Phase 12 — Responsiveness, fallbacks & resilience
1. Full pass on every range in Design.md §13 incl. landscape phones, ultrawide, 200% zoom.
2. Reduced motion mode, lite tier, no-WebGL, `<noscript>` content.
3. Every item in Security.md (error pages, slow/offline handling, context loss, popup-blocked fallback).
4. Accessibility: keyboard path through the whole site, focus states, screen-reader text for all canvas content, contrast.
5. SEO: metadata, OG image, sitemap, robots, manifest. Remove `/styleguide`.

**Done when:** every checklist item in Rules.md §9 is ticked with evidence.

## Phase 13 — Performance
Bundle analysis, code-split heavy scenes (dynamic import of Scene 02/03 3D + visuals), compress assets, dispose three resources on unmount, verify no memory growth over 3 full scrolls.
Targets (measure, report actual): Lighthouse Performance ≥ 90 desktop, ≥ 75 mobile; LCP < 2.5s; CLS < 0.05; INP < 200ms; initial JS ≤ 250 KB gzip (3D chunk loads after loader starts).

## Phase 14 — QA & handover
1. Real tests only, written to `docs/QA_REPORT.md`: browsers (Chrome, Firefox, Safari/WebKit via Playwright), viewports (360×740, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080, 2560×1080), reduced motion, offline, slow 3G throttle.
2. README: run locally, edit content, add a project, rerun asset scripts.
3. Final commit `feat: HASI DESIGNS cinematic portfolio` and push. **Do not deploy.**

⛔ **Final stop** — report to the owner: what was built, real test results, known limitations, how to deploy on Vercel (import repo, framework Next.js, no env vars).
