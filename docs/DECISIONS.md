# Decisions

> Every deviation from, or interpretation of, the `_brief/` spec — with the reason. Newest at the bottom.
> Status: **OPEN** = needs the owner · **DECIDED** = taken, owner informed at the next stop · **OWNER** = the owner's own call.

---

### D-001 · Branch — OWNER
- All work is committed and pushed straight to `main` (owner's answer at Approval Stop 1).

### D-002 · ME.png source — DECIDED
- The only copy available is the image attached in chat (WebP, 1122 × 1402, RGB with ICC profile).
- Saved to `_brief/assets/ME.png` as a **lossless** PNG conversion, verified pixel-identical to the attachment. No other change.
- If a larger original of the same photo arrives, it replaces this file and `npm run assets:portrait` is re-run. Nothing is upscaled.

### D-003 · Red area — OWNER
- Rules.md §2.1 caps red at ~3 % of a static frame; Design.md §9 asks for more on specific screens.
- **Owner's call:** on those screens **Design.md wins** — Scene 01's red diagonal plane (~25 % of the frame), Scene 06's large red diagonal plane, and THE RED CUT sweep.
- Everywhere else the ~3 % signal rule stays.

### D-004 · Featured toolkit object removed — OWNER
- The owner's own tool is **not shown anywhere on the site and no information about it is kept in the repository.** Its references were removed from `_brief/` (App, Design, Phases, Rules, Structure, reference, prompt).
- Scene 02 keeps the Core as its only special object, with the 17 tools around it.

### D-005 · Missing Simple Icons — DECIDED
- Checked against `simple-icons@16.38.0`: **`openai` (ChatGPT) and `visualstudiocode` no longer exist** in the library. `claude`, `figma`, `github`, `openjdk`, `javascript`, `typescript`, `react`, `nextdotjs`, `html5`, `css` (not `css3`), `tailwindcss`, `python`, `vercel`, `supabase`, `linux`, `whatsapp`, `instagram`, `gmail` exist.
- Per Design.md §12: ChatGPT and VS Code are rendered as **Archivo monogram tiles** with their names. No imitation logos.

### D-006 · Network — DECIDED
- This container's network policy blocks GitHub release downloads (where `rembg` fetches its model). npm, PyPI and Google Fonts are reachable.
- If the `rembg` model cannot be fetched: the spec's own fallback — a luminance/colour-distance key with edge feathering (Phases.md §3.1). The portrait is a near-black silhouette on light grey, which suits a luminance key well. Shown for approval at Stop 2.

### D-007 · 3D typeface source — DECIDED
- The 3D HASI is generated from **Archivo variable instanced at wght 900 / wdth 125** (fontTools), not from the separate "Archivo Black" family.
- Reason: the loader's DOM letters and the 3D letters must be the same shapes for the shared-element handoff to be seamless (Design.md §9 Loader).

### D-008 · CSP in development — DECIDED
- Security.md §2 CSP is applied in production builds only. Next.js dev mode needs `eval` for fast refresh; production stays exactly as specified.

### D-009 · Device-orientation parallax on iOS — DECIDED
- iOS only grants motion sensors after a permission tap, and no such prompt is in the spec. Adding one would add UI that wasn't asked for.
- Gyro parallax works where no prompt is needed (most Android browsers). iOS gets no parallax, which Design.md already allows ("else none").

### D-010 · Anti-generic check vs the brief — DECIDED
- Each scene is checked against an anti-generic checklist before it is shown. That checklist flags some things the brief deliberately chooses: near-black + one red accent, mono labels, "02 — TOOLKIT" labels, 01–06 numbering, the CTA sheen, plate tilt and dust.
- Chosen by the brief → they stay, but only where the spec puts them. The numbering is a real sequence (scenes of a film).

### D-011 · Grain on the `mid` tier — DECIDED
- Design.md §6 disables grain on `low`; Security.md §5 only says "grain on" for `high`. `mid` keeps grain (a static texture, near-zero cost).

### D-012 · No projects displayed for now — OWNER
- **Owner's call:** no projects are shown on the site for now.
- How it is built: Scene 04 is still built exactly to Design.md (plates, status chips, lift, panel, `/projects/[slug]`), driven by `src/content/projects.ts`. That list ships **empty**, and an empty list means the scene **does not render at all** — no empty grid, no placeholder, no "coming soon".
- The film then plays as five scenes, and the scene index numbers itself from what is actually rendered (01–05). The day a project is added to `projects.ts`, Scene 04 appears in its place and the index becomes 01–06, with no other code change.
- Transitions follow the scene that is **entering**: Toolkit enters by RED CUT, What I Create by depth push, Projects by RED CUT, Philosophy by depth push, Final by RED CUT. With projects hidden, What I Create → Philosophy uses Philosophy's depth push.
- No screenshots, covers or project images are produced now; `scripts/capture-screenshots.mjs` is kept for later. The project data stays in `_brief/Design.md` as the reference for when they are published.
- Rules.md §9 items about projects are tested with a temporary local fixture only, never shipped.

### D-013 · Tailwind configuration — DECIDED
- Current Tailwind (v4) is configured in CSS (`@theme` in `globals.css`) rather than `tailwind.config.ts`. This matches Rules.md §4.3 ("tokens only in `globals.css` + `lib/tokens.ts`"), so `tailwind.config.ts` from Structure.md is not created. Breakpoints from Design.md §13 are defined in the same `@theme` block.

### D-014 · Scene 06 backdrop = the photo's own backdrop — OWNER
- **Owner's direction:** in the final scene, the page background must be exactly the same as ME.png's background, with some creativity.
- **How:** the photo's studio backdrop (bright glow behind the head, falling off to darker grey at the edges) is **measured from the image** and recreated as a resolution-independent gradient that fills any screen size. The cutout portrait sits on it, so the edges blend seamlessly.
- **Why the cutout is still made:** the giant statements sit *between* the backdrop and his head/shoulders (Design.md §9 Scene 06). That layering only works with a transparent portrait.
- **The creative idea:** five scenes in a dark obsidian room, then the RED CUT sweeps and the room **lights up** — the creator stands in his own light. The palette flip happens only here, which makes the reveal unmistakable.
- Type and red on the light backdrop (statement colour, rim, diagonal) are designed in Phase 11 and shown at that stop. The backdrop's greys are neutral tones, not a new hue.

### D-015 · Next.js 16 configuration — DECIDED
- `cacheComponents` / `partialPrefetching` **off**: with them on, an empty `generateStaticParams` is a build error (Next 16 docs), and the projects list ships empty. The site is fully static, so they add nothing.
- `agentRules: false`: otherwise `next dev` writes an `AGENTS.md` into the repo (not in Structure.md).
- Bundle analysis uses the built-in **`next analyze`** (Turbopack). `@next/bundle-analyzer` only works with webpack builds, so it is not installed (Rules.md §4.4 — no unused dependencies).
- Tailwind runs through the `@tailwindcss/turbopack` loader that `create-next-app` sets up, so no `postcss.config.mjs` is needed.
- `npm run typecheck` runs `next typegen` first, because `LayoutProps` / `PageProps` are generated route types.
- `playwright` is pinned to **1.63.0**, the version of the browser preinstalled in this environment.
- Favicon: static `public/favicon.svg` (Structure.md allows "or static favicon"), so `app/icon.tsx` is not created.
- `sitemap.ts` and `opengraph-image.tsx` are created in Phase 12 with the designed OG image and the production URL; `manifest.ts` and `robots.ts` exist now.

### D-016 · Portrait method and sizes — DECIDED
- `rembg` is not installable here (its model download is blocked), so `scripts/process-portrait.py` used the spec's fallback, done as a **difference matte**: the backdrop is modelled from the visible background, and each edge pixel's opacity is how much it darkens that backdrop, measured against the subject colour right next to it (black hair, lit skin). Interior pixels are copied unchanged (verified: max difference 1.3/255, which is rounding). The script still prefers rembg automatically where it is available.
- Composited on the photo's own backdrop (Scene 06, D-014), the cutout reproduces the original photo; the hair keeps its real backlit glints.
- Native size after trimming is **1040 × 1188**, so the set is `me-1040.webp/png`, `me-640.webp`, `me-400.webp` (not 1600/1000/600 — no upscaling). Total 373 KB (< 600 KB budget).
- Measured backdrop: neutral grey (R = G = B), elliptical glow centred at 50 % / 65 % of the photo, x-stretch 1.3, falling from #FCFCFC behind him to #727272 at the edges (RMS fit error 5.2/255).

### D-017 · Generated font files — DECIDED
- `scripts/build-typeface.py` (not in Structure.md; added so the font files are reproducible) instances Archivo at wght 900 / wdth 125 and writes `public/fonts/archivo-black.typeface.json` (A–Z, 0–9, 14 KB; verified with three.js TextGeometry).
- It also writes three 7 KB static subsets to `src/app/_og/` for the Open Graph image (the OG renderer cannot read variable woff2). `_og` is a private folder — Next.js never routes it.
- Grain: 256 × 256 tileable noise quantised to 9 grey levels (31 KB instead of 62 KB; identical at 4 % opacity).
- Project screenshots and covers: none generated — no projects are displayed (D-012). `scripts/capture-screenshots.mjs` runs and reports "nothing to capture" until a LIVE project is added.

### D-018 · Scene 01 arrival is time-based — DECIDED
- Design.md §9 lists Scene 01 0–35 % (plane slides in, name/roles/statement rise) "after loader handoff". Played as a scroll-scrubbed range, a first-time visitor would land on HASI alone and see the name only after scrolling half a screen.
- The arrival plays **once, right after the handoff** (time-based), so the first frame is complete within seconds (App.md §6.1). From 35 % on everything is scroll-driven as specified (camera dolly + tilt, raking key light, name block parallax, RED CUT). The final CTA is likewise time-triggered at 80 %, as the spec asks.

### D-019 · Scene 01 name block on an obsidian plate — DECIDED
- The ~25 % red diagonal (D-003) runs from the bottom-left corner — exactly under the name block. Ice text on red fails contrast, and a soft scrim turned the red muddy.
- The block sits on a **solid obsidian plate** (sharp, no radius): a poster caption over the red band, ≥ 4.5 : 1 contrast. The same plate language is used for small chrome over the red (scene rail, Instagram, scroll cue).

### D-020 · `app/loading.tsx` removed — DECIDED
- With `loading.tsx`, Next streams the page behind a Suspense fallback that only JavaScript swaps in. Without JavaScript the visitor saw just the HASI outline (verified). Security.md §6 requires a complete no-JS page, which wins over the Structure.md file list. The inline obsidian background already guarantees no white flash before hydration.

### D-021 · three.js pinned to 0.182.0 — DECIDED
- three r183 deprecates `THREE.Clock` and logs a warning, while @react-three/fiber 9.8.2 (latest) still constructs one. Rules.md §9 forbids console warnings in production, so three/@types/three are pinned to 0.182.0, the last release before the deprecation. Upgrade once R3F moves to `THREE.Timer`.

### D-022 · Scroll engine and motion features load during the loader — DECIDED
- Initial JS was 297 KB gzip (target ≤ 250). GSAP, ScrollTrigger and Lenis (`lib/gsap.ts`, `lib/lenis.ts`) and Framer Motion's animation features (`lib/motion-features.ts`, via `LazyMotion`) are now fetched while the loader runs and count toward its real progress. Result: **235 KB**. If the engine fails to load, the page falls back to the static stacked version.

### D-023 · Touch chapter snapping — DECIDED
- ScrollTrigger's `snap` receives a velocity-projected destination; after a fast flick it projected past the page end and jumped there (verified). Replaced with a settle-based snap: on touch, once scrolling stops inside Scene 03, the page eases to the nearest chapter if it is within 60 % of a screen; anywhere else the scroll is left alone.

### D-024 · Static-mode reveals by scroll position — DECIDED
- IntersectionObserver can skip elements during fast scrolls or jumps (a supporting line never appeared in testing). Reduced-motion reveals now check element positions on scroll (rAF-throttled).

### D-025 · Slow-connection hydration — DECIDED
- The loader read `navigator.connection` during its first render; on slow connections that produced different text than the server HTML (React #418) and the loader dropped out. Connection-dependent text is now read after hydration. A CSS-timed copy of the 6-second "taking longer" note covers the time before JavaScript arrives, and the JS notice times itself from navigation start.

### D-026 · Inactive scene numbers at ice-60 — DECIDED
- Design.md §6 sets inactive scene-index numbers to `--ice-30`; Design.md §2 sets `--ice-60` as the minimum for any readable text, and Lighthouse flagged 2.35 : 1. Accessibility wins: inactive numbers use ice-60 (active stays ice + red hairline).

### D-027 · Static final scene — DECIDED
- In cine mode the two final statements share one position (one replaces the other). In reduced-motion / no-JS mode they would overlap the portrait, so the second statement (still in the DOM for screen readers) is shown as an ice line across the shirt, just above the CTA.

### D-028 · Files added beyond Structure.md — DECIDED
- `lib/director.ts` (the scroll director), `lib/icons.ts` (Simple Icons subset shared by 3D and 2.5D), `lib/motion-features.ts` (async Framer features), `lib/portrait.generated.ts` (generated), `components/three/anchor.ts` (tool-label anchor, avoids a circular import), `components/chrome/nav.ts` (shared scene navigation + focus helper), `components/ui/StatusPage.tsx` (404 / error layout), `components/scenes/s03-create/visuals/types.ts`, `scripts/build-typeface.py`, `src/app/_og/*.ttf`.
- Not created: `tailwind.config.ts`, `postcss.config.mjs` (D-013, D-015), `app/icon.tsx` (static favicon), `app/loading.tsx` (D-020), `content/fulldev.ts` and its panel (D-004).
