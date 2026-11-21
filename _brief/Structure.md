# Structure.md — HASI DESIGNS · Codebase

> Exact project structure. Every file listed has a defined purpose. Do not add folders that are not here without a reason recorded in `docs/DECISIONS.md`.

**Stack:** Next.js (App Router, latest stable) · TypeScript (strict) · React Three Fiber + @react-three/drei + three · GSAP + ScrollTrigger · Lenis · Framer Motion · Tailwind CSS · Zustand (tiny shared store) · Simple Icons · Lucide · next/font (Archivo, Geist, Geist Mono). Package manager: **npm**.

**Routing:** one cinematic page (`/`), a project detail route (`/projects/[slug]`) for non-live projects, plus 404 / error pages. Statically generated — no server, no database, no API routes, no environment variables required.

---

## Tree

```
MY-PORTFOLIO/
├── _brief/                         # Spec + raw inputs provided by the owner (kept in repo, read-only)
│   ├── App.md
│   ├── Structure.md
│   ├── Phases.md
│   ├── Design.md
│   ├── Rules.md
│   ├── Security.md
│   ├── reference.md
│   ├── prompt.txt
│   └── assets/
│       ├── Video.mp4               # Inspiration reference video (NOT shipped to the site)
│       └── ME.png                  # Original silhouette portrait (source for processed asset)
│
├── docs/
│   ├── PROGRESS.md                 # Phase checklist, updated at the end of every phase
│   ├── DECISIONS.md                # Any deviation from the spec + reason
│   ├── REFERENCE_ANALYSIS.md       # Written in Phase 1 from Video.mp4 study
│   └── QA_REPORT.md                # Real test results (Phase 12)
│
├── scripts/
│   ├── extract-reference-frames.sh # ffmpeg: Video.mp4 → frames for study (output to /tmp, not committed)
│   ├── process-portrait.py         # ME.png → background removed, trimmed, optimized WebP/AVIF/PNG + blur placeholder
│   └── capture-screenshots.mjs     # Playwright: screenshots of LIVE project URLs → public/projects/
│
├── public/
│   ├── me/
│   │   ├── me-1600.webp            # Processed portrait (transparent), large
│   │   ├── me-1000.webp            # Medium
│   │   ├── me-600.webp             # Small (mobile)
│   │   ├── me-1600.png             # Transparent PNG fallback
│   │   └── me-placeholder.txt      # Base64 tiny blurred silhouette for instant paint
│   ├── projects/
│   │   ├── dollar-store-pos.webp   # Real screenshot (captured)
│   │   ├── goods-transport-pos.webp# Real screenshot (captured)
│   │   └── covers/                 # Generated typographic covers for non-live projects (SVG)
│   │       ├── kaam.svg
│   │       ├── binary-wizard.svg
│   │       └── prosol.svg
│   ├── fonts/
│   │   └── archivo-black.typeface.json  # Typeface JSON for 3D Text (generated from Archivo, OFL)
│   ├── textures/
│   │   └── grain.png               # 256×256 tileable noise
│   └── favicon.svg                 # "H" monogram, ice on obsidian, red corner cut
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # <html lang="en">, fonts, metadata, global providers, skip link, <noscript> fallback
│   │   ├── page.tsx                # Composes <Experience/>: Loader → Chrome → Canvas → Scenes 01–06
│   │   ├── globals.css             # Tailwind layers, CSS variables (tokens), base resets, reduced-motion rules
│   │   ├── not-found.tsx           # Branded 404
│   │   ├── error.tsx               # Route-level error boundary UI
│   │   ├── global-error.tsx        # Root error boundary UI
│   │   ├── loading.tsx             # Minimal obsidian + HASI outline (pre-hydration)
│   │   ├── projects/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Detail page for non-live projects (static params from content)
│   │   ├── opengraph-image.tsx     # 1200×630 OG image: HASI giant type, red diagonal, name
│   │   ├── icon.tsx                # App icon generation (or static favicon)
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── manifest.ts             # name "HASI DESIGNS", theme #111217
│   │
│   ├── content/                    # ALL editable personal content lives here (single source of truth)
│   │   ├── site.ts                 # brand, name, roles, statement, location, contact (email, whatsapp, instagram, github), prefilled messages
│   │   ├── toolkit.ts              # tools: id, name, group, line, simpleIconSlug, featured
│   │   ├── fulldev.ts              # Full Dev panel copy + link
│   │   ├── disciplines.ts          # 6 disciplines: index, title, line, tags, visualId
│   │   ├── projects.ts             # projects: slug, name, description, category, status, url?, image, featured, order
│   │   ├── philosophy.ts           # main line + supporting lines
│   │   └── final.ts                # final statements, CTA label, option labels
│   │
│   ├── components/
│   │   ├── Experience.tsx          # Orchestrates loader state, tier detection, providers, scene mounting
│   │   ├── chrome/
│   │   │   ├── Wordmark.tsx
│   │   │   ├── SceneIndex.tsx      # Desktop rail / mobile top progress bar
│   │   │   ├── TalkLink.tsx
│   │   │   ├── InstagramLink.tsx
│   │   │   ├── ScrollCue.tsx
│   │   │   ├── Cursor.tsx
│   │   │   ├── Grain.tsx
│   │   │   └── SkipLink.tsx
│   │   ├── loader/
│   │   │   ├── Loader.tsx          # Outline → fill HASI, counter, progress line, handoff
│   │   │   └── SlowNotice.tsx      # Delay messaging + "Enter lite version" (Security.md §4)
│   │   ├── transitions/
│   │   │   ├── RedCut.tsx          # Signature −18° red plane transition (scroll-tied)
│   │   │   └── DepthPush.tsx       # Scale/fade depth transition helper
│   │   ├── scenes/
│   │   │   ├── SceneShell.tsx      # Shared: section element, id, pin setup, aria-label, timeline registration
│   │   │   ├── s01-identity/
│   │   │   │   ├── Scene01Identity.tsx
│   │   │   │   ├── NameBlock.tsx
│   │   │   │   └── LettersFallback.tsx   # DOM faux-3D HASI for lite/no-WebGL
│   │   │   ├── s02-toolkit/
│   │   │   │   ├── Scene02Toolkit.tsx
│   │   │   │   ├── ToolLabel.tsx         # DOM label anchored to projected 3D position
│   │   │   │   ├── FullDevPanel.tsx
│   │   │   │   ├── ToolkitA11yList.tsx   # Visually hidden focusable list mirroring 3D tools
│   │   │   │   └── Toolkit2D.tsx         # 2.5D DOM version (mobile / lite)
│   │   │   ├── s03-create/
│   │   │   │   ├── Scene03Create.tsx
│   │   │   │   ├── Chapter.tsx
│   │   │   │   └── visuals/
│   │   │   │       ├── VisualWeb.tsx
│   │   │   │       ├── VisualAgents.tsx
│   │   │   │       ├── VisualSaaS.tsx
│   │   │   │       ├── VisualPOS.tsx
│   │   │   │       ├── VisualTrading.tsx
│   │   │   │       └── VisualDesign.tsx
│   │   │   ├── s04-projects/
│   │   │   │   ├── Scene04Projects.tsx
│   │   │   │   ├── ProjectPlate.tsx
│   │   │   │   ├── StatusChip.tsx
│   │   │   │   └── ProjectPanel.tsx      # Slide-in detail panel (?project=slug)
│   │   │   ├── s05-philosophy/
│   │   │   │   ├── Scene05Philosophy.tsx
│   │   │   │   └── LightBeam.tsx
│   │   │   └── s06-final/
│   │   │       ├── Scene06Final.tsx
│   │   │       ├── Portrait.tsx          # ME image + rim light + rise
│   │   │       ├── CtaButton.tsx
│   │   │       ├── ContactOptions.tsx    # EMAIL / WHATSAPP / copy fallback
│   │   │       └── Footer.tsx
│   │   ├── three/
│   │   │   ├── Stage.tsx           # The single persistent <Canvas>: camera, lights, fog, post, scene switch
│   │   │   ├── CameraRig.tsx       # Scroll + pointer driven camera
│   │   │   ├── Lights.tsx          # Key (ice) + rim (red) + ambient
│   │   │   ├── Dust.tsx            # Instanced particles
│   │   │   ├── HasiLetters.tsx     # Text3D HASI with materials + per-letter hover rim
│   │   │   ├── RedPlane.tsx        # 3D red diagonal plane (Scene 01)
│   │   │   ├── Core.tsx            # Monolith (Scene 02)
│   │   │   ├── ToolTile.tsx        # One tool object
│   │   │   ├── ToolOrbit.tsx       # Places tiles in depth rings
│   │   │   ├── materials.ts        # Shared matte obsidian, brushed metal, ice-front materials
│   │   │   └── SceneErrorBoundary.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Panel.tsx           # Accessible dialog: focus trap, Esc, outside click, back gesture, return focus
│   │       ├── MaskText.tsx        # Mask-rise text reveal primitive
│   │       ├── SplitLetters.tsx    # Letter-build primitive (keeps accessible text)
│   │       ├── MonoLabel.tsx
│   │       └── Toast.tsx           # "COPIED", offline notices
│   │
│   ├── lib/
│   │   ├── tokens.ts               # Colors, easings, durations (mirror of CSS vars for JS/GSAP/three)
│   │   ├── gsap.ts                 # GSAP + ScrollTrigger registration, defaults
│   │   ├── lenis.ts                # Lenis setup + ScrollTrigger sync
│   │   ├── tier.ts                 # Device/quality tier detection (high/mid/low/none)
│   │   ├── preload.ts              # Asset manifest + real progress tracking + timeouts + retries
│   │   ├── contact.ts              # Builds encoded mailto / wa.me URLs from content/site.ts
│   │   ├── a11y.ts                 # Reduced motion / contrast media helpers
│   │   └── utils.ts                # clamp, lerp, map, cn()
│   │
│   ├── hooks/
│   │   ├── useScene.ts             # Registers a scene timeline, exposes progress
│   │   ├── useTier.ts
│   │   ├── useReducedMotion.ts
│   │   ├── usePointer.ts           # Normalized pointer, lerped
│   │   ├── useVisibility.ts        # Tab visibility / in-view
│   │   └── useNetwork.ts           # online/offline, saveData, effectiveType
│   │
│   ├── store/
│   │   └── experience.ts           # Zustand: loaderState, tier, activeScene, sceneProgress, hoveredTool, openPanel
│   │
│   └── types/
│       └── content.ts              # Types for every content file
│
├── .github/
│   └── workflows/
│       └── ci.yml                  # npm ci → lint → typecheck → build (no deploy)
├── next.config.ts                  # Security headers, images config, no powered-by header
├── tailwind.config.ts              # Tokens wired to CSS vars, screens per Design.md §13
├── postcss.config.mjs
├── tsconfig.json                   # strict: true, path alias @/*
├── eslint.config.mjs
├── .prettierrc
├── .gitignore                      # node_modules, .next, /tmp, .env*, coverage, playwright artifacts
├── .nvmrc                          # LTS Node
├── package.json
├── LICENSE                         # Owner's choice; default "All rights reserved" notice for content
└── README.md                       # What it is, run locally, how to edit content, how to add a project, asset pipeline
```

---

## Responsibilities & data flow

1. `page.tsx` renders `<Experience/>`.
2. `Experience` → detects tier (`lib/tier.ts`), starts preloading (`lib/preload.ts`) with the asset manifest, shows `<Loader/>`, mounts `<Stage/>` (3D canvas, fixed, z-0) and all scenes (DOM, scroll content).
3. Each scene uses `<SceneShell>` + `useScene()` to create its pinned GSAP timeline and writes `activeScene` / `sceneProgress` into the store.
4. `<Stage/>` reads the store and shows/animates the 3D content belonging to the active scene (HASI letters, red plane, Core, tools). 3D objects for non-adjacent scenes are unmounted or hidden to save GPU.
5. All text and data come from `src/content/*` — components never hard-code personal content.
6. Contact URLs are built only in `lib/contact.ts`.

## Content shapes (`src/types/content.ts`)
```ts
type ProjectStatus = 'LIVE' | 'IN_DEVELOPMENT' | 'CONCEPT';
interface Project { slug: string; name: string; description: string; category: string;
  status: ProjectStatus; url?: string; image: string; imageAlt: string; featured: boolean; order: number; }
interface Tool { id: string; name: string; group: 'AI'|'Design'|'Development'|'Infrastructure';
  line: string; simpleIconSlug?: string; featured?: boolean; }
interface Discipline { index: string; title: string; line: string; tags: string[];
  visualId: 'web'|'agents'|'saas'|'pos'|'trading'|'design'; }
```
Adding a project = add one object to `projects.ts` (+ image in `public/projects/`). Nothing else changes.

## Scripts (package.json)
`dev`, `build`, `start`, `lint`, `typecheck`, `format`, `assets:portrait` (runs process-portrait.py), `assets:screens` (runs capture-screenshots.mjs), `analyze` (bundle analyzer).
