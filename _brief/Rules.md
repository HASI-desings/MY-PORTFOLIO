# Rules.md — HASI DESIGNS · Rules for the AI

> Non-negotiable. If a rule conflicts with another file, **Rules.md wins**, then Design.md, then the rest. Record any unavoidable deviation in `docs/DECISIONS.md` and tell the owner.

---

## 1. Truth & content
1. Use only facts in App.md and `src/content/*`. **Never invent** clients, years of experience, awards, metrics, testimonials, skills, tools or quotes.
2. Name is **HUSSNAIN SOHAIL**. Brand is **HASI DESIGNS**. Check spelling everywhere (metadata, alt text, OG image, footer).
3. Never fabricate screenshots, links, emails or phone numbers. Only the contact details in App.md.
4. Project status must be honest: LIVE / IN DEVELOPMENT / CONCEPT. Never present a concept as finished.
5. Decorative numbers in Scene 03 visuals must be obviously illustrative (no claims like "10k users").
6. The only image of the creator is ME.png. Do not generate, alter, retouch, upscale or "enhance" his face or body. Background removal only.

## 2. Design
1. Only the HASI palette and its derived neutrals (Design.md §2). No new hues. Red stays ≤ ~3% of any static frame.
2. Fonts: Archivo, Geist, Geist Mono only.
3. No glassmorphism, neon, gaming glow, random gradients, rounded friendly cards, emoji, stock icons, stock photos, template sections, lorem ipsum.
4. No six identical cards in Scene 03. No logo grid in Scene 02. No ordinary card grid in Scene 04.
5. One main idea per viewport. Respect the visibility tiers (Design.md §4).
6. The creator does **not** appear before Scene 06.
7. Do not copy the reference video's layouts, names, colours, typography, characters, assets or text. Take principles only (reference.md).

## 3. Motion
1. Animate only `transform`, `opacity`, `clip-path`, filters and shader uniforms.
2. Never animate everything at once; stagger and sequence per Design.md §7.
3. No bounce/elastic easings. Use the motion tokens.
4. All scroll animations must be reversible (scrolling up rewinds cleanly).
5. Reduced motion must be fully supported (Design.md §11).

## 4. Code quality
1. TypeScript strict; no `any` without a comment explaining why.
2. One responsibility per component; scenes are modules; no giant single component.
3. Personal content only in `src/content/*`. Tokens only in `globals.css` + `lib/tokens.ts`.
4. No unused dependencies. No dependency for something a few lines can do.
5. Dispose Three.js geometries/materials/textures on unmount. No memory leaks.
6. No `console.log` in committed code (use a dev-only logger if needed).
7. ESLint + typecheck + build must pass before every commit.
8. Comments explain *why*, not *what*.

## 5. Performance
1. One persistent WebGL canvas. Render on demand; pause when hidden/off-screen.
2. Respect quality tiers; auto step-down on low FPS (once per session).
3. Lazy-load heavy scene code and 3D assets after the loader begins.
4. Images: next/image or explicit width/height; modern formats; no layout shift.
5. Meet the targets in Phases.md Phase 13 or report why not.

## 6. Accessibility
1. All meaningful text exists in the DOM (not only in canvas). Canvas is `aria-hidden`.
2. Every interactive element: keyboard reachable, visible focus, accessible name, min 44×44px touch target.
3. Panels are proper dialogs (focus trap, Esc, return focus).
4. Hover-only information is forbidden; every T3 has tap + focus equivalents.
5. Respect `prefers-reduced-motion` and `prefers-contrast`.
6. Language `en`; logical heading order (one `h1` = HASI DESIGNS / name).

## 7. Responsiveness
1. Must work and look intentional on every size in Design.md §13, portrait and landscape.
2. Use `svh/dvh`, safe-area insets, container queries where layouts depend on component width.
3. Test 200% zoom. No horizontal page overflow at any width (except intentional cropped giant type inside an `overflow: hidden` scene).

## 8. Git & delivery
1. Repo `HASI-desings/MY-PORTFOLIO`, branch `main`.
2. Phase 0 deletes all old files except `.git/` and `_brief/`. Never delete `_brief/`.
3. Conventional commits (`feat:`, `fix:`, `chore:`, `perf:`, `docs:`), at least one per phase, pushed.
4. **Do not deploy.** Do not connect Vercel, do not create preview deployments, do not add hosting config beyond what Next.js needs.
5. Never commit secrets, `.env` files, `node_modules`, build output or `/tmp` frames.
6. Do not commit `Video.mp4` frame extractions. `Video.mp4` stays only in `_brief/assets/` and is never served by the site.

## 9. Definition of done (all must be true, with evidence in docs/QA_REPORT.md)
- [ ] All six scenes match Design.md on desktop, tablet, phone, landscape phone, ultrawide.
- [ ] Loader shows real progress and hands off seamlessly.
- [ ] RED CUT and depth push transitions work both directions.
- [ ] 17 tools + Full Dev; hover/tap/focus all work.
- [ ] 5 projects with honest status; live links open; panel + detail route work.
- [ ] Email and WhatsApp open prefilled; copy fallback works.
- [ ] Instagram link in the corner.
- [ ] Reduced motion, lite tier, no-WebGL, no-JS all produce a complete, readable site.
- [ ] 404 and error pages branded; slow/offline behaviors per Security.md.
- [ ] Keyboard-only walkthrough possible end to end.
- [ ] Performance targets measured and reported.
- [ ] No console errors or warnings in production build.
- [ ] Committed and pushed; not deployed.

## 10. Working behavior
1. Follow Phases.md in order; stop at every ⛔ approval stop.
2. Explain work to the owner **section by section** (architecture, scroll timeline, 3D setup, loading pipeline) — not line by line.
3. Report only tests that actually ran. Never claim something works without verifying it.
4. If the spec is ambiguous, choose the option that best serves App.md §4, record it in DECISIONS.md, and mention it at the next stop.
5. If something requested would hurt performance, accessibility or honesty, say so plainly and propose the better move.
6. When later fixing bugs for the owner: give the complete content of each changed file at its exact repo path.
7. Treat every component as the most important part of the project. No throwaway work.
