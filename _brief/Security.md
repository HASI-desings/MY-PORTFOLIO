# Security.md — HASI DESIGNS · Security, Errors, Waiting & Frustration Control

> Anything that could break, stall, confuse or annoy a visitor is listed here with its solution. The site is static (no server, no database, no forms posting data), which keeps the attack surface small — keep it that way.

---

## 1. Threat surface (and why it is small)
- No backend, no API routes, no auth, no database, no cookies, no analytics, no third-party scripts.
- No user input is sent anywhere — contact happens through `mailto:` and `wa.me` links opened by the visitor's own apps.
- Only first-party assets served from the same origin. Fonts self-hosted via `next/font`.
- **Rule:** do not add trackers, chat widgets, embeds or CDN scripts.

## 2. HTTP security headers (`next.config.ts` → `headers()`)
| Header | Value |
|---|---|
| Content-Security-Policy | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self'; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self' mailto:; object-src 'none'; upgrade-insecure-requests` (tighten `unsafe-inline` with nonces if feasible; document the choice) |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(self), gyroscope=(self)` |
| X-Frame-Options | `DENY` |
| Cross-Origin-Opener-Policy | `same-origin` |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
Also `poweredByHeader: false`.

## 3. Links & contact safety
- All external links: `target="_blank" rel="noopener noreferrer"`.
- `lib/contact.ts` builds `mailto:` and `wa.me` URLs with `encodeURIComponent` for every parameter; the phone number is digits only (`923141481275`). No user-supplied text is ever interpolated into HTML.
- Project URLs come only from `content/projects.ts` and are validated at build time (must start with `https://`); invalid → treated as no URL.
- `?project=slug` is matched against known slugs only; unknown slug → ignored (no panel, no error).
- Email is shown as text deliberately (it's a public contact); obfuscation is not required, but render it via JS-built `mailto` to reduce naive scraping.

## 4. Loading & waiting (the "never stare at nothing" rules)
| Situation | Behavior |
|---|---|
| First paint (pre-hydration) | `loading.tsx` / SSR HTML shows obsidian + HASI outline instantly — never a white flash. `<html>` background `#111217` set inline. |
| Normal load | Loader with **real** progress (Design.md §9 Loader). Min display 1.2s so it never flickers. |
| Load > 6s | `SlowNotice` fades in under the counter: "Taking longer than usual — building the experience…" (mono, ice-60). |
| Load > 12s | Adds button **"ENTER LITE VERSION"** (switches to lite tier and enters immediately) and keeps loading full assets in background. |
| A single asset fails | Retry up to 2× with backoff (800ms, 2000ms). Still failing → mark it missing, continue; the dependent component uses its fallback (DOM letters, cover image, 2.5D toolkit). Never block the whole site on one asset. |
| Critical failure (JS chunk error) | Error boundary → `error.tsx` branded screen with "RELOAD" and "CONTINUE TO LITE VERSION". |
| Progress counter | Monotonic (never goes backward), eased, never shows 100 before truly ready. |
| Fonts slow | `display: swap` with metric-matched fallbacks (`adjustFontFallback`) — no layout jump. |
| Images | Portrait uses blur placeholder; plates use obsidian placeholder with mono "LOADING" shimmer-free pulse. |

## 5. Quality tiers & device protection
| Tier | When | What changes |
|---|---|---|
| `high` | WebGL2, ≥ 8 cores or desktop GPU, no saveData | Full experience, DPR ≤ 2, particles 400, grain on |
| `mid` | WebGL2, average devices / most phones | DPR ≤ 1.5, particles 150, simpler fog, Scene 02 3D allowed on ≥ 640px |
| `low` | deviceMemory ≤ 4, saveData, effectiveType 2g/3g, low FPS fallback | DPR 1, no particles, no grain, 2.5D toolkit, simplified Scene 03 visuals |
| `none` | No WebGL or reduced motion | No canvas; DOM fallbacks everywhere; static compositions with fades |
- FPS monitor: if average < 40fps for 2s → step down one tier (once).
- WebGL `webglcontextlost` → switch affected scenes to DOM fallback immediately; attempt restore once on `webglcontextrestored`.
- Each 3D scene wrapped in `SceneErrorBoundary` — a crash in one shows that scene's DOM fallback; the rest keeps running.

## 6. Error pages
| Page | Design |
|---|---|
| **404** (`not-found.tsx`) | Obsidian. Giant "404" in Archivo (ice-10 ghost) with "LOST IN THE PROCESS." `--fs-h1` ice, mono line "This page doesn't exist — every idea starts somewhere, though.", red button "BACK TO HASI" → `/`. Red diagonal low-right. |
| **Error** (`error.tsx`) | "SOMETHING BROKE." + mono "The experience hit an error. You can retry or continue with the lite version." Buttons: "RETRY" (calls `reset()`), "LITE VERSION". |
| **Global error** (`global-error.tsx`) | Self-contained (inline styles, no fonts dependency), same copy, "RELOAD". |
| **No JS** (`<noscript>`) | Complete static version: name, statement, toolkit list, disciplines, projects with links, philosophy, contact links. Styled with inline CSS in the palette. |
All error pages: no technical stack traces shown to visitors; logs only in dev.

## 7. Network conditions
- **Offline** (`navigator.onLine` false / `offline` event): Toast "You're offline — the experience will continue with what's loaded." Contact options still work (mail app / WhatsApp app queue). External project links show "Needs internet" tooltip.
- **Back online:** toast "Back online." and resume any pending asset loads.
- **Save-Data / slow connection:** start in `low` tier automatically; message in loader footer "Lite mode for your connection".

## 8. Interaction frustration — prevented
| Risk | Solution |
|---|---|
| Scroll hijack feels stuck | Lenis lerp 0.1 (not floaty); native scroll on touch; pins never exceed lengths in Design.md; scene index lets users jump. |
| Can't find contact | "LET'S TALK" always visible (top-right) until Scene 06; Skip link "Skip to contact". |
| Scroll position lost on resize/rotate | Save progress ratio → restore after `ScrollTrigger.refresh()`. |
| Back button / reload position | `history.scrollRestoration = 'manual'` + restore last scene from `sessionStorage` (wrapped in try/catch); reload starts at top only if no saved state. |
| Hover info unreachable on touch | Tap equivalents everywhere; tap outside to dismiss. |
| Accidental double-click on CTA | Debounce 400ms; options open once. |
| `mailto:` does nothing (no mail app) | After click, if the page is still focused after 1.2s, show toast: "No mail app opened? Copy the address instead." + copy button. |
| WhatsApp blocked/popup blocked | Use a real `<a href>` (not `window.open`) so it's never blocked; copy-number fallback shown under options. |
| Clipboard API unavailable | Fallback: select text in a hidden input + `execCommand('copy')`; if all fail, show the text selected for manual copy. |
| iOS 100vh jumps | `svh` for pinned scenes, `dvh` only for fixed overlays. |
| Text unreadable over 3D | Scenes keep a darkened zone (gradient scrim in obsidian) behind any body text; min contrast 4.5:1. |
| Motion sickness | Reduced motion respected; camera moves ≤ 8° tilt, no fast rotations, no flashing (> 3 flashes/s forbidden). |
| Panel traps user | Esc, ×, outside click, back gesture all close it. |
| Layout shift while loading | Reserved dimensions for every image and canvas. |
| Zoomed text breaks layout | Fluid type with clamp + test at 200% zoom. |

## 9. Privacy
- No cookies, no tracking, no analytics, no fingerprinting. Tier detection stays in memory only.
- `sessionStorage` only for scroll restoration (no personal data).
- If the owner later adds analytics, it must be privacy-friendly and disclosed.

## 10. Dependencies & build hygiene
- `npm audit` at Phase 2 and Phase 14; fix high/critical.
- Lockfile committed. Exact versions resolved by npm, no unpinned git dependencies.
- `.gitignore` covers `.env*`, `node_modules`, `.next`, `/tmp`, Playwright artifacts.
- CI runs lint, typecheck, build on every push (no deploy step, no secrets).
