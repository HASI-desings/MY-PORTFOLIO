# QA Report — HASI DESIGNS

> Phase 12–14 evidence. **Only tests that actually ran are listed**, with their real results.
> Environment: Linux container, Node 22, production build (`npm run build` + `next start`), headless **Chromium 1243** (Playwright 1.63.0). WebGL runs on **SwiftShader (software, CPU)** in this container — this matters for every performance number below.

---

## 1. Build health

| Check | Result |
|---|---|
| `npm run lint` | ✅ 0 errors, 0 warnings |
| `npm run typecheck` (`next typegen` + `tsc --noEmit`, strict) | ✅ pass |
| `npm run build` | ✅ static routes: `/`, `/_not-found`, `/opengraph-image`, `/manifest.webmanifest`, `/robots.txt`, `/sitemap.xml`, `/projects/[slug]` (no paths while no projects are published) |
| `npm audit` | ✅ 0 vulnerabilities |
| Console in production (all runs below) | ✅ no errors or warnings from the site. Only `GL Driver Message … GPU stall due to ReadPixels` appears, emitted by SwiftShader when Playwright reads the canvas for a screenshot — not by the site |

## 2. Security headers (`curl -I` against `next start`)

✅ `Content-Security-Policy` (exactly as Security.md §2), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy`, `Strict-Transport-Security`; no `X-Powered-By`. Unknown `/projects/*` → 404.

## 3. Viewports (Chromium) — Rules.md §9

Each viewport: load, wait for the loader, capture Scene 01, Scene 02 (≈62 %), Scene 03 (chapter 2), Scene 05 and the final frame; check horizontal overflow and console.

| Viewport | Horizontal overflow | Console | Reaches final scene | Notes |
|---|---|---|---|---|
| 360 × 740 (touch) | none | clean | ✅ | 3D letters (mid tier), 2.5D toolkit, vertical chapters |
| 390 × 844 (touch) | none | clean | ✅ | same |
| 768 × 1024 (touch) | none | clean | ✅ | vertical chapters (portrait tablet) |
| 1024 × 768 | none | clean | ✅ | horizontal chapters |
| 1440 × 900 | none | clean | ✅ | full experience verified separately with `?tier=high` |
| 1920 × 1080 | none | clean | ✅ | |
| 2560 × 1080 (ultrawide) | none | clean | ✅ | full 3D verified with `?tier=high` |
| 844 × 390 landscape phone | none | clean | ✅ | short-screen layout: HASI upper half, name plate below (fixed during QA) |
| 200 % zoom (720 × 450 CSS px @2×) | none | clean | ✅ | same short-screen layout |

**Automatic step-down observed (by design):** at desktop sizes SwiftShader renders below 40 fps, so the FPS guard stepped the tier down once and the canvas gave way to the DOM versions. That is Design.md §11 working; the full 3D path was verified with `?tier=high`, which disables the guard.

## 4. Modes and fallbacks

| Mode | How tested | Result |
|---|---|---|
| No JavaScript | `javaScriptEnabled: false`, full-page capture | ✅ complete stacked page (8000 px): HASI with faux depth, name, toolkit tiles, all six disciplines with finished visuals, philosophy, final portrait + direct Email/WhatsApp links. *Found and fixed:* `app/loading.tsx` made Next stream the page behind a JS-only fallback — removed (D-020). |
| Reduced motion | `reducedMotion: "reduce"` | ✅ `html.static`, no canvas, no pinning; sections fade in by scroll position (IntersectionObserver missed fast scrolls — replaced, D-024); CTA visible without travel |
| Lite tier | `?tier=low` | ✅ no canvas; DOM HASI with layered-shadow depth + red plane; 2.5D toolkit with CSS Core |
| Full 3D | `?tier=high` | ✅ 3D HASI on the measured DOM letters, red plane, dust, Core, 17 tiles, RED CUT clip planes, depth push |
| Tier drop after arrival | observed during matrix runs | ✅ DOM letters return; DOM red plane appears in place (fixed during QA) |
| Offline / back online | `context.setOffline(true/false)` | ✅ "You're offline — the experience will continue with what's loaded." then "Back online." |
| Slow network | CDP throttle 400 kbps / 400 ms latency, cache disabled | ✅ first paint obsidian (never white); CSS-timed "taking longer" note before JS arrives; JS hydrates ≈ 9.7 s; counter monotonic (0 → 12 → 42 → 51 → 55 → 80 → 95 → 99 → 100); ENTER LITE VERSION shown at 12 s. *Found and fixed:* a hydration mismatch (React #418) on slow connections that dropped the loader (D-025). |

## 5. Interaction

| Flow | Desktop 1440 × 900 | Mobile 390 × 844 (touch) |
|---|---|---|
| First Tab = "Skip to contact" | ✅ | ✅ |
| Enter on skip link → final scene, CTA focused | ✅ | ✅ |
| CTA → CHOOSE A CHANNEL, focus moves to EMAIL | ✅ | ✅ |
| EMAIL `mailto:RanaHasi302@gmail.com?subject=Project%20inquiry%20%E2%80%94%20via%20HASI%20DESIGNS&body=…` (CRLFs encoded) | ✅ | ✅ |
| WHATSAPP `https://wa.me/923141481275?text=…`, `target=_blank`, `rel=noopener noreferrer` | ✅ | ✅ |
| COPY email → clipboard holds `RanaHasi302@gmail.com` | ✅ | ✅ |
| Esc closes options, focus returns to CTA | ✅ | ✅ |
| Touch scrolling stays where the visitor puts it; chapters snap only when settled nearby | ✅ (ScrollTrigger's velocity snap jumped to the page end — replaced, D-023) | |

The real hand-off to a mail app or WhatsApp cannot be exercised headlessly; the URLs above are what the visitor's apps receive.

## 6. Projects system (with a temporary fixture — never committed)

Three fixture projects (LIVE / CONCEPT / IN DEVELOPMENT) were added locally, built and tested, then removed (`git diff` empty for `projects.ts`).

✅ Scene 04 appears automatically, the index becomes 01–06 · plates rise and travel · LIVE plate links out with `noopener noreferrer` · OPEN PROJECT on a concept opens the panel and sets `?project=slug` · Esc closes, focus returns, URL cleaned (fixed during QA) · deep link `?project=fixture-concept` opens the panel · unknown slug ignored · `/projects/fixture-concept` → 200 · `/projects/fixture-live` → 404.

## 7. Performance (Phase 13)

| Metric | Target | Measured | Notes |
|---|---|---|---|
| Initial JS (gzip, scripts in the HTML) | ≤ 250 KB | **235 KB** | was 297 KB; GSAP/ScrollTrigger/Lenis and Framer Motion's engine now load while the loader runs |
| Lazy 3D (three + R3F + scene) | after loader starts | ≈ 245 KB gzip | fetched as part of the loader's real progress |
| CSS | — | 12 KB gzip | |
| Portrait set | < 600 KB | 373 KB | |
| CLS | < 0.05 | **0.003** desktop · **0.009** mobile | Lighthouse |
| LCP | < 2.5 s | **0.8 s** desktop · 3.8 s mobile (Lighthouse 4× CPU throttle) | |
| Lighthouse Accessibility / Best Practices / SEO | — | **100 / 100 / 100** (desktop and mobile) | after the contrast and ARIA fixes |
| Lighthouse Performance | ≥ 90 desktop · ≥ 75 mobile | **60 desktop · 49 mobile — not met here** | see below |
| JS heap over 3 full scroll passes (3D on) | no growth | 13.4 → 14.4 → 14.6 → 14.8 MB | warm-up + ~0.2 MB/pass, no runaway growth; three.js objects disposed on unmount |

**Why Lighthouse Performance is low here, honestly:** Total Blocking Time is 3.2 s (desktop) / 13.8 s (mobile), almost entirely "Other" main-thread work inside the three.js chunk — SwiftShader rasterising the 3D scene **on the CPU**. On a device with a GPU that work runs on the GPU and does not block the main thread. FCP (0.3 s), LCP (0.8 s) and CLS are well inside targets. **This must be re-measured on real hardware after deploy** (PageSpeed Insights on the Vercel URL). If mobile still falls short, the first levers are: lowering `mid` tier DPR to 1.25, and defaulting phones to the lite tier.

## 8. Not tested (and why)

- **Firefox and Safari/WebKit:** only Chromium is installed in this environment, so no Firefox or WebKit runs were possible here. Run them after deploy.
- **Real iOS / Android devices, real GPUs:** not available in the container.
- **Screen readers:** accessible names, roles, focus order and live regions were checked via the DOM and Lighthouse; no VoiceOver/NVDA session was run.
