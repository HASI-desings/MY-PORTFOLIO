# HASI DESIGNS

The cinematic, scroll-controlled portfolio of **Hussnain Sohail** — software engineering student, developer and digital creator from Lahore, Pakistan.

Five connected scenes (six once projects are published), all live code:

| # | Scene | What happens |
|---|---|---|
| 01 | Identity | Giant 3D **HASI**, built from the same Archivo instance as the loader letters it lands on; a red diagonal; name, roles, statement |
| 02 | Toolkit | The Core monolith; 17 real tools fly in and float in three depth rings; hover / tap / focus lifts a tool and shows its line |
| 03 | What I create | Six disciplines, each with its own code-built visual (browser frames, agent graph, dashboard, receipt + inventory, candlesticks + EMA signal, wireframe → UI) |
| 04 | Selected projects | Built and data-driven, **hidden while `projects.ts` is empty** |
| 05 | Philosophy | CREATIVITY IS A PROCESS, NOT A TRAIT. — lit by a moving beam |
| 06 | Final | The room lights up to the photo's own studio backdrop; the portrait rises with a red rim; LET'S MAKE IT REAL → prefilled Email / WhatsApp |

## Run locally

Node.js 24 (`.nvmrc`; any Node ≥ 20.9 works).

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production check: `npm run build` then `npm start`.

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Development server / production build / serve the build |
| `npm run lint` | ESLint (Next + TypeScript rules, React Compiler rules) |
| `npm run typecheck` | Generates Next route types, then `tsc --noEmit` (strict) |
| `npm run format` | Prettier |
| `npm run assets:portrait` | `_brief/assets/ME.png` → `public/me/*` (cutout, sizes, blur placeholder) + `src/lib/portrait.generated.ts` |
| `npm run assets:fonts` | Archivo → 3D typeface JSON + OG font subsets |
| `npm run assets:screens` | Screenshots of LIVE projects → `public/projects/*.webp` |
| `npm run analyze` | Turbopack bundle analyzer |

Python scripts need `pip install pillow numpy scipy fonttools brotli` (`rembg` optional).

**QA helpers:** add `?tier=high`, `?tier=mid`, `?tier=low` or `?tier=none` to the URL to force a quality tier (the FPS guard leaves a forced tier alone).

## Edit content

Everything personal lives in **`src/content/`** — animation code never needs to change:

- `site.ts` — name, roles, statement, location, email, WhatsApp, Instagram, GitHub, prefilled messages
- `toolkit.ts` — the 17 tools (name, group, one line, Simple Icons slug)
- `disciplines.ts` — the six disciplines (title, line, tags)
- `philosophy.ts` — the statement and the three supporting lines
- `final.ts` — final statements, CTA and labels
- `projects.ts` — projects (empty for now)

## Add a project

1. Add one object to `src/content/projects.ts`:

   ```ts
   {
     slug: "dollar-store-pos",
     name: "Dollar Store POS",
     description: "An offline-first point-of-sale and business management system.",
     category: "POS & Business",
     status: "LIVE", // or "IN_DEVELOPMENT" | "CONCEPT"
     url: "https://dollar-store-sable.vercel.app/#/sell", // https only; omit if not live
     image: "/projects/dollar-store-pos.webp",
     imageAlt: "Dollar Store POS — sell screen",
     featured: true,
     order: 1,
   },
   ```

2. Put its image in `public/projects/` — for LIVE projects run `npm run assets:screens` to capture a real screenshot (never a fake one).
3. That's it: Scene 04 appears, the scene index renumbers, non-live projects get a panel (`?project=slug`) and a page at `/projects/<slug>`.

## How it's built (short)

- **Director** (`src/lib/director.ts`): one fixed stage, one tall scroll track, one GSAP master timeline scrubbed by ScrollTrigger. Each scene registers its own 0→1 timeline (`useSceneTimeline`); the director stretches it to the scene's length, derives every scene's progress, runs THE RED CUT (clip-paths on the layers + matching clip planes in 3D) and the depth push, and toggles which layers are visible and `inert`.
- **3D** (`src/components/three/`): one persistent React Three Fiber canvas, loaded during the loader, rendering only while a 3D scene is on screen and the tab is visible.
- **Tiers** (`src/lib/tier.ts`): `high` / `mid` / `low` / `none` from WebGL support, cores, memory, connection and reduced motion; an FPS guard steps down once; WebGL context loss falls back to DOM without reload.
- **Modes**: an inline script picks `cine` (scroll film) or `static` (reduced motion) before first paint; with no JavaScript the page is a complete stacked site.

## Docs

`_brief/` (specification, read-only) · `docs/PROGRESS.md` · `docs/DECISIONS.md` · `docs/REFERENCE_ANALYSIS.md` · `docs/QA_REPORT.md`

## Deploy (Vercel)

Not deployed by this repository's tooling. In Vercel: **Add New → Project → import `HASI-desings/MY-PORTFOLIO`**, framework preset **Next.js**, no environment variables, deploy. Vercel's production URL is picked up automatically for metadata, the sitemap and the OG image.
