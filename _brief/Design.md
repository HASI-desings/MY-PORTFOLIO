# Design.md — HASI DESIGNS · Design System, Layout & Motion

> The single source of truth for how everything looks, where everything sits, and how everything moves and reacts.

---

## 1. Design philosophy

1. **Architecture, not decoration.** Typography is built like structures in a space — heavy, lit, casting depth.
2. **Darkness is the canvas.** Obsidian is the room. Ice grey is the light. Red is the signal.
3. **Red means "this matters."** Only for actions, active states, focus, and the signature diagonal transition. Never a large background area except during a transition sweep.
4. **One idea per screen.** If two things compete, one moves down the visibility hierarchy (§4).
5. **Motion has weight.** Things ease in like heavy objects: slow start avoided, fast arrival, long settle. Nothing bounces. Nothing is cute.
6. **Earned reveal.** The creator is not shown until Scene 06.
7. **Precision over effects.** Sharp edges, exact alignment, a tight grid. Effects only when they carry meaning.

Visual sources of the language: luxury editorial photography, brutalist typography, minimal industrial design, cinematic lighting, matte and metallic surfaces.

**Never:** generic SaaS layouts, glassmorphism, neon/gaming glow, random gradients, stock icon sets, rounded "friendly" cards, emoji, template sections.

---

## 2. Color system

### Core palette (exact)
| Token | Hex | Name | Role |
|---|---|---|---|
| `--obsidian` | `#111217` | Obsidian Black | Dominant: backgrounds, 3D environments, surfaces, nav |
| `--ice` | `#DFE5EB` | Ice Grey | Dominant contrast: all main type, giant lettering, outlines, light |
| `--red` | `#EF233C` | Racing Red | Signal: CTAs, hover/active, selected states, focus ring, diagonal transition |

### Derived neutrals (allowed — tints/shades of the core only)
| Token | Hex | Use |
|---|---|---|
| `--obsidian-900` | `#0B0C10` | Deepest shadow, vignette edge |
| `--obsidian-800` | `#16171D` | Raised surface (project plate base, panels) |
| `--obsidian-700` | `#1E2028` | Borders on dark, dividers |
| `--graphite` | `#2B2E36` | Secondary surfaces, Core monolith base color |
| `--ice-60` | `rgba(223,229,235,.60)` | Secondary text |
| `--ice-30` | `rgba(223,229,235,.30)` | Tertiary text, hairlines |
| `--ice-10` | `rgba(223,229,235,.10)` | Ghost lettering, grid lines |
| `--red-deep` | `#B8172B` | Pressed state of red, red in shadow |
| `--red-glow` | `rgba(239,35,60,.35)` | Rim light, glow under CTA |

### Distribution
~80% obsidian family · ~17% ice family · ~3% red. **No other hues.** Exceptions: real project screenshots and real brand logos in Scene 02 (logos rendered monochrome ice by default, their **original brand color only on hover**).

### Contrast
Body text ice on obsidian (≈15:1). `--ice-60` minimum for any readable text. Red text only ≥ 18px bold. Text on red buttons: obsidian `#111217`.

---

## 3. Typography

| Role | Family (Google Fonts) | Settings |
|---|---|---|
| **Display** (giant lettering, scene titles) | **Archivo** (variable: wght 100–900, wdth 62–125) | wght 800–900, wdth 115–125 for HASI; wdth 62–75 condensed for long statements; tracking −0.04em; uppercase |
| **Text** (body, labels, UI) | **Geist** | 400/500; tracking −0.01em |
| **Mono** (indices, counters, metadata, status chips) | **Geist Mono** | 400/500; uppercase; tracking +0.08em; 11–13px |

Self-host via `next/font/google` (no layout shift, `display: swap`, subset latin).

### Fluid type scale (clamp)
| Token | Value | Use |
|---|---|---|
| `--fs-mega` | `clamp(6rem, 28vw, 32rem)` | HASI, scene-filling words |
| `--fs-giant` | `clamp(3rem, 11vw, 12rem)` | Philosophy line, final statements |
| `--fs-h1` | `clamp(2.25rem, 6vw, 5.5rem)` | Scene titles, discipline titles |
| `--fs-h2` | `clamp(1.5rem, 3.2vw, 2.75rem)` | Name line, project titles |
| `--fs-body-l` | `clamp(1.05rem, 1.4vw, 1.35rem)` | Statement, supporting lines |
| `--fs-body` | `1rem` | Body |
| `--fs-small` | `0.875rem` | Descriptions |
| `--fs-micro` | `0.75rem` | Mono labels |

Line-height: display 0.82–0.9 · headings 1.0 · body 1.5. Max body measure 60ch.

---

## 4. Visibility hierarchy (apply to every piece of content)

| Tier | Shown | Trigger | Content |
|---|---|---|---|
| **T1** | Immediately | none | HASI, scene titles, nav wordmark, scene index, primary CTA |
| **T2** | As the visitor arrives | scroll position | Name line, statement, tool objects, discipline titles, project plates, philosophy lines, final statements |
| **T3** | On intent | hover (desktop) · tap (touch) · focus (keyboard) | Tool name + one line, discipline tags, project category/status, small details |
| **T4** | On demand | click/tap → panel | Project detail view, discipline detail list |
| **T5** | On commitment | CTA click | Email / WhatsApp options |

Rules: one T1/T2 idea per viewport · every T3 has a touch and keyboard equivalent · every T4 panel closes with Esc, close button, outside click, and mobile back gesture, and returns focus to its trigger.

---

## 5. Layout, grid & spacing

- **Grid:** 12 columns desktop (gutter `clamp(16px,2vw,32px)`, outer margin `clamp(20px,5vw,96px)`), 8 cols tablet, 4 cols mobile.
- **Spacing scale (px):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192.
- **Radii:** 0 everywhere. Exception: CTA button 2px, status chips 2px.
- **Lines:** 1px hairlines in `--ice-10` / `--obsidian-700`.
- **Units:** use `svh`/`dvh` for full-height scenes (never raw `vh` on mobile); `env(safe-area-inset-*)` for fixed UI.
- **Z-index map:** canvas 0 · scene content 10 · scene foreground type 20 · fixed chrome 50 · panels/overlays 80 · contact sheet 90 · loader 100 · grain 110 (pointer-events none) · cursor 120.

---

## 6. Global chrome (fixed UI — exact placement)

| Element | Position | Behavior |
|---|---|---|
| **Wordmark "HASI"** | top-left, `top: 24px; left: margin` (safe-area aware) | Archivo 800, 18px, ice. Click → scroll to top (smooth, 1.4s). Hidden during loader. |
| **Scene index** | right edge, vertically centered, desktop/tablet | Vertical list `01–06` in Geist Mono 11px, `--ice-30`; active number ice + 24px red hairline to its left. Click → scroll to scene. Mobile: becomes a 2px progress bar at the very top (red fill = page progress). |
| **"LET'S TALK" link** | top-right | Mono 12px uppercase, ice; hover → red underline draws left→right 320ms. Click → scroll to Scene 06 and auto-focus the CTA. Hidden while in Scene 06. |
| **Instagram** | bottom-left, `bottom: 24px` (safe-area aware) | Mono 11px "IG / @hussnain_7979", `--ice-60`; hover → ice + red dot before it. Opens new tab. Always visible except loader. |
| **Scroll cue** | bottom-center, Scene 01 only | Mono 11px "SCROLL" + 32px hairline with a 1px red segment travelling down (loop 1.8s). Fades out after first 80px of scroll. Touch: "SWIPE". |
| **Sound** | none | The site is silent. |
| **Custom cursor** | desktop with fine pointer only | 8px ice dot + 32px ring (`--ice-30`), lerp 0.18. Over interactive → ring grows to 56px, turns red, dot hides. Over text-heavy areas → default. Disabled on touch and reduced motion. |
| **Grain** | full-screen overlay | Static noise texture, opacity 0.04, `mix-blend-mode: overlay`. Disabled on low tier. |

---

## 7. Motion system

### Tokens
| Token | Value |
|---|---|
| `--ease-out` (arrivals) | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out` (moves) | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--ease-in` (exits) | `cubic-bezier(0.7, 0, 0.84, 0)` |
| `--dur-micro` | 180ms (hover color, small toggles) |
| `--dur-short` | 320ms (buttons, chips, underline draws) |
| `--dur-med` | 600ms (panel open, tool lift) |
| `--dur-long` | 900ms (text reveals) |
| `--dur-cine` | 1400ms (scene-level moves, loader exit) |
| Stagger | 60ms (letters) · 90ms (list items) · 140ms (tools) |

### Engine
- **Lenis** smooth scroll (lerp 0.1 desktop; native scroll on touch) synced to **GSAP ScrollTrigger**.
- Each scene is a **pinned** ScrollTrigger timeline with `scrub: 0.8` (desktop) / `scrub: true` (touch). Scroll lengths in §9.
- 3D runs in **one persistent React Three Fiber canvas** fixed behind all scenes; scenes tell it what to show via a shared store. Render on demand (`frameloop="demand"`) when nothing animates; never render when tab hidden or canvas off-screen.
- Micro-interactions (hover, panels, buttons): Framer Motion.
- **Never** animate width/height/top/left — only `transform`, `opacity`, `clip-path`, shader uniforms.

### Text reveal patterns (reuse everywhere)
- **Mask rise:** each line in an `overflow:hidden` wrapper; inner translates from `110%` → `0` with `--ease-out`, `--dur-long`, line stagger 90ms.
- **Letter build:** letters from `opacity 0, translateY(40%), rotateX(-60deg)` → rest, 60ms stagger.
- **Exit:** reverse with `--ease-in` at 60% duration.

### Signature transition — "THE RED CUT"
Between scenes 01→02, 03→04 and 05→06: a sharp red plane (`--red`) at **−18°** sweeps across the viewport from bottom-left to top-right, tied to scroll (≈40vh of scroll). The outgoing scene is clipped away by its leading edge, the incoming scene is revealed by its trailing edge — the red is visible as a band ~18vw wide at the midpoint. Implemented with `clip-path: polygon()` on scene wrappers + one red div. Reduced motion → 400ms cross-fade.

Between 02→03 and 04→05: **"Depth push"** — the camera dollies forward through the outgoing scene (3D) or the outgoing layer scales to 1.08 and fades while the next rises from 0.96 (DOM), 1.0s equivalent of scroll.

---

## 8. Lighting & materials language (3D and CSS)

- **Key light:** cool, soft, from top-left, ice-tinted.
- **Rim light:** red (`#EF233C`), from behind-right, thin and sharp — on lettering edges, the Core, and the ME.png silhouette.
- **Materials:** matte obsidian (roughness 0.85, metalness 0.1); brushed metal accents (roughness 0.35, metalness 0.9); no glossy plastic.
- **Atmosphere:** very faint volumetric haze (shader fog, density low), dust particles (≤ 400 desktop, ≤ 120 mobile, 0 low tier) drifting slowly, catching the key light.
- **Vignette:** radial, `--obsidian-900` at edges, 35%.

---

## 9. Scenes — composition, components, timelines, interactions

Scroll lengths are pin durations. Percentages refer to that scene's own timeline.

### LOADER (before Scene 01)
- **Layout:** full obsidian. Center: "HASI" in Archivo 900 at `--fs-giant` as **outline only** (1px `--ice-30` stroke). Bottom-left: mono counter `000` → `100`. Bottom-right: mono "HASI DESIGNS — LAHORE, PK". A 1px red line spans the bottom edge, width = progress.
- **Behavior:** letters **fill with ice from bottom to top** proportional to real asset progress (clip-path on a filled copy). Counter is real progress, eased (never jumps backward, never fakes 100).
- **Exit (when ready + min 1.2s shown):** counter fades; filled HASI scales up to `--fs-mega` and translates to its Scene 01 position (shared-element handoff, 1.4s `--ease-in-out`), red line retracts to the right, loader background dissolves to reveal the 3D room. The giant letters of Scene 01 **are** the loader letters — seamless.
- Delay/failure behavior: Security.md §4.

### SCENE 01 — THE IDENTITY · pin 220svh
**Composition (desktop):** HASI enormous, centered horizontally, baseline at ~62% height, letters partially cropped by viewport edges on narrow screens (intentional). Red diagonal plane behind the letters from bottom-left to mid-right at −18°, covering ~25% of the frame. Name block bottom-left inside the grid (cols 1–5): name (`--fs-h2`, Archivo 800, ice), roles (mono, `--ice-60`), statement (`--fs-body-l`, Geist, max 36ch). Scroll cue bottom-center.

**The lettering:** 3D extruded HASI (`Text3D`, Archivo Black-weight typeface JSON), matte obsidian faces with **ice-lit front faces** (ice emissive-ish front material so they read light against dark) and a red rim on edges; depth ≈ 0.25 of letter height. Low tier / no WebGL: DOM letters with layered text-shadows for faux depth.

**Timeline (after loader handoff):**
- 0–10%: camera rests; dust drifts; red plane slides in from left (clip reveal) to its position.
- 10–35%: name line mask-rises, then roles, then statement (stagger 120ms).
- 35–100%: camera slowly dollies left and tilts up (≈8°), letters rake light across their faces (key light moves), name block parallaxes upward at 1.3× scroll; ends with THE RED CUT into Scene 02.

**Interactions:** cursor/gyro parallax — camera orbits ±3° following pointer (lerp 0.06); mobile uses device orientation if permitted, else none. Hovering a letter → that letter's rim intensifies to full red (`--dur-short`).

### SCENE 02 — THE TOOLKIT · pin 320svh
**Composition:** the Core (tall matte monolith, 1:3.2 proportions, graphite with red edge chamfers) center frame, rotating 0.08 rad/s. Tools orbit in three depth rings (near/mid/far) asymmetrically — never a grid, never a perfect circle. Scene title top-left: mono "02 — TOOLKIT" + `--fs-h1` "THE ECOSYSTEM".

**Tool objects:** each tool = a thin rounded-square tile (radius tiny, 0.06) of brushed dark metal with the tool logo embossed in ice on its face (from Simple Icons SVG → extruded/shape geometry or textured plane). Subtle idle float (sine, amplitude 0.04, unique phase) and slow yaw.

**Tool list & lines** (content/toolkit.ts — group shown as mono caption on hover):
| Tool | Group | Line |
|---|---|---|
| Claude | AI | AI pair-engineer for building, reviewing and shipping code. |
| ChatGPT | AI | Research, ideation and prompt drafting. |
| Figma | Design | Interfaces, flows and design systems. |
| VS Code | Development | Daily editor for every project. |
| GitHub | Development | Version control and open-source work. |
| Java | Development | OOP foundations and desktop applications. |
| JavaScript | Development | The language of everything interactive. |
| TypeScript | Development | Typed, safer large codebases. |
| React | Development | Component-driven interfaces. |
| Next.js | Development | Full-stack web apps and sites. |
| HTML | Development | Semantic structure. |
| CSS | Development | Layout, motion and visual craft. |
| Tailwind CSS | Development | Fast, consistent styling systems. |
| Python | Development | Automation, scripts and AI model training. |
| Vercel | Infrastructure | Deploying and hosting. |
| Supabase | Infrastructure | Databases, auth and realtime backends. |
| Linux | Infrastructure | Daily development environment. |

**Timeline:**
- 0–15%: (arriving from RED CUT) Core rises from below frame into center, title mask-rises.
- 15–60%: tools enter one by one (stagger 140ms of scroll-equivalent) from beyond the far plane, flying to their orbit slots with `--ease-out`.
- 60–90%: camera orbits ~35° around the Core; tools hold, idle.
- 90–100%: depth push into Scene 03.

**Interactions:** hover/tap tool → it moves 0.35 units toward camera, scales 1.15, yaw resets to face viewer, logo takes its brand color, other tools dim to 40% (`--dur-med`). A label appears anchored beside it (DOM, projected position): mono group caption, tool name `--fs-h2`, one line `--fs-small`. Leave → reverse. Keyboard: tools are focusable buttons in a visually hidden list; focus = hover state. Touch: first tap = focus/label, second tap elsewhere = dismiss.

**Mobile/low tier:** 2.5D DOM version — tools as tiles in a loose, staggered, asymmetric scatter around a CSS Core; parallax on scroll; same tap behavior.

### SCENE 03 — WHAT I CREATE · pin 6 × 110svh
**Structure:** six chapters. Desktop: chapters advance **horizontally** inside the pin (track translates −100vw per chapter). Mobile: vertical stack, each chapter 100svh, snap.

**Every chapter layout:** left (cols 1–5): giant mono index "01"…"06" in `--fs-giant` `--ice-10` (ghost), title `--fs-h1`, one line `--fs-body-l`, tags row (T3 on hover of the title: mono chips). Right (cols 6–12): the chapter's **live visual** (canvas/SVG/DOM, no images). Bottom: thin progress (6 segments, active red).

| # | Title | One line | Live visual |
|---|---|---|---|
| 01 | Websites & Digital Experiences | Responsive sites, landing pages and immersive web. | Three browser frames assemble in perspective; inside, wireframe blocks build into a layout; a cursor dot moves and a section scroll-animates within the frame. |
| 02 | AI Automation & Agentic Systems | Agents, AI workflows and automated business processes. | Node graph: nodes appear, edges draw, red pulses travel along edges node-to-node; one node labeled "AGENT" branches into tasks. Pointer near a node → it attracts pulses. |
| 03 | Custom Software & SaaS | Custom applications, platforms and SaaS products. | Dashboard modules (chart, table, KPI, sidebar) slide and snap into a grid like magnets; numbers tick (fake neutral values clearly decorative, no claims). |
| 04 | POS & Business Management | Point of sale, billing, inventory, staff, expenses, analytics. | A receipt prints from a slot line by line (mono), a red scan line sweeps a barcode, an inventory bar chart updates. |
| 05 | Trading & Financial Technology | Trading tools, TradingView indicators, automation, fintech apps. | Live candlestick chart drawing left→right with an EMA line and a red signal marker when a crossover occurs; pointer x shows crosshair. |
| 06 | UI/UX & Product Design | Interfaces, design systems, prototypes, interaction design. | A wireframe screen morphs into a finished UI (strokes → fills), a type specimen and swatch row of the HASI palette appear. |

Tags per chapter (T3): e.g. 01 → `NEXT.JS · REACT · GSAP · THREE.JS`, 02 → `CLAUDE · PYTHON · APIS · AGENTS`, 03 → `TYPESCRIPT · SUPABASE · DASHBOARDS`, 04 → `OFFLINE-FIRST · BILLING · INVENTORY`, 05 → `TRADINGVIEW · INDICATORS · AUTOMATION`, 06 → `FIGMA · DESIGN SYSTEMS · PROTOTYPING`. Only tools from the toolkit list.

**Per-chapter timeline:** 0–25% title/line mask-rise + visual begins; 25–75% visual runs (scrub-driven, reversible); 75–100% chapter exits left with 1.0 → 0.96 scale while next enters. Ends with THE RED CUT into Scene 04.

### SCENE 04 — SELECTED PROJECTS · pin 280svh
**Composition:** a dark surface plane (subtle reflection, `--obsidian-800`) viewed at a slight top-down angle (CSS 3D perspective 1400px, rotateX 14°). Five project **plates** (16:10, large: ~38vw desktop) laid on it in a staggered row, translated horizontally with scroll. Title top-left: mono "04 — WORK" + `--fs-h1` "SELECTED PROJECTS".

**Plate anatomy:** screenshot (or designed cover) · bottom-left inside a gradient scrim: mono index "01", title `--fs-h2`, category mono `--ice-60` · top-left status chip: LIVE (red dot pulsing 2s + "LIVE"), IN DEVELOPMENT (ice outline), CONCEPT (dashed ice-30 outline).

**Hover/tap (the lift):** plate `translateZ(60px) translateY(-14px) rotateX(-6deg) scale(1.03)` over `--dur-med` `--ease-out`; shadow deepens below (blurred obsidian-900 ellipse grows and softens); short description (2 lines) mask-rises; **OPEN PROJECT ↗** button (red, obsidian text) slides up from the plate's bottom edge. Other plates dim to 55%. Pointer-move over plate → tilt ±4° following pointer. Touch: tap once = lift (others drop), tap button = open; tap outside = drop.

**OPEN PROJECT:** LIVE → real URL, new tab, `rel="noopener noreferrer"`. Not live → **project detail panel** (T4, slides in from right, 600ms): cover, title, status, category, description, "Live link not available yet" (mono, ice-60). URL updates to `?project=slug` for shareable state.

**Projects (content/projects.ts):**
| # | Name | Category | Status | URL | Description |
|---|---|---|---|---|---|
| 01 | Dollar Store POS | POS & Business | LIVE | https://dollar-store-sable.vercel.app/#/sell | An offline-first point-of-sale and business management system. |
| 02 | Goods Transport Company POS | POS & Business | LIVE | https://rstg.vercel.app/ | A business-oriented point-of-sale and management solution. |
| 03 | KAAM | Platform | CONCEPT | — | A digital platform concept focused on connecting people with services and opportunities. |
| 04 | Binary Wizard | Trading | IN DEVELOPMENT | — | A trading-related project involving TradingView signals. |
| 05 | ProSol | Software Ecosystem | IN DEVELOPMENT | — | A broader software solutions platform and digital product ecosystem. |

(Statuses for 03–05 are defaults — the owner may edit them in the content file.)

**Images:** LIVE projects → real screenshots captured from the live URLs (Phases.md). Non-live → **designed typographic covers** (obsidian, project name in Archivo, a red diagonal, mono "CONCEPT"/"IN DEVELOPMENT") — clearly covers, never fake app screenshots.

**Timeline:** 0–15% title rises, plates rise from the surface (stagger 90ms); 15–95% plate row translates horizontally (desktop) — the plate nearest center auto-gets a softer "pre-lift" (6px) to show focus; 95–100% depth push into Scene 05. Mobile: vertical list of plates, each full-width, tap to lift.

### SCENE 05 — THE PHILOSOPHY · pin 300svh
**Composition:** pure typography in a dark room. The main line in Archivo condensed (wdth 70), `--fs-giant`, ice, stacked over 3–4 lines, left-aligned to grid col 1, filling ~80% of the viewport:
**CREATIVITY / IS A PROCESS, / NOT A TRAIT.**
A narrow vertical light beam (shader or CSS gradient mask) sweeps across the letters as the visitor scrolls, lighting them; unlit parts sit at `--ice-10`.

**Timeline:**
- 0–40%: words build one by one (letter build pattern), the light beam follows the newest word.
- 40–55%: whole line fully lit; "NOT A TRAIT." gets a red underline stroke drawing left→right (2px, scroll-scrubbed).
- 55–90%: the giant line recedes (scale 0.92, `--ice-30`), and three supporting lines appear one at a time in the right half (cols 7–12), `--fs-body-l`, each with a mono index (I, II, III):
  - "Ideas become valuable when they are executed."
  - "I enjoy understanding problems, experimenting with possibilities, and building solutions that actually work."
  - "Technology is not just about writing code. It's about creating something useful."
- 90–100%: THE RED CUT into Scene 06.

**Interactions:** pointer horizontal position nudges the light beam ±8% (desktop). Hover a supporting line → it goes full ice, others drop to `--ice-30`.

### SCENE 06 — THE FINAL INTERACTION · pin 200svh, then the page ends
**Composition (desktop):** ME.png (background removed, see Phases) centered horizontally, bottom-anchored, height ~88svh, rising from the bottom edge. Behind him, `--fs-giant` statements (ice) centered, partly occluded by his head/shoulders for depth. Red rim light: a `drop-shadow(0 0 14px var(--red-glow))` plus a thin red edge (CSS filter stack or a duplicated, red-tinted, 2px-offset blurred copy behind) — subtle, mostly on hair and shoulders. A large red diagonal plane at −18° sits low behind him (lower-right), echoing the brand posters. Footer line at the very bottom (mono 11px, `--ice-30`): "© 2026 HASI DESIGNS · LAHORE, PAKISTAN".

**Timeline:**
- 0–20%: (from RED CUT) obsidian; red diagonal slides in low.
- 20–45%: ME.png rises from 12% below its rest position with opacity 0 → 1, brightness 0.4 → 1, rim light fades in.
- 45–65%: "EVERY IDEA STARTS SOMEWHERE." mask-rises behind him.
- 65–80%: it lifts up/out; "LET'S BUILD SOMETHING." rises in.
- 80–100%: **the CTA rises** from below the viewport bottom to the lower-middle (≈ 78svh from top on desktop, 72svh on mobile), centered horizontally, overlapping his lower torso. Spring-free, `--ease-out`, 900ms once triggered at 80% (not scrubbed — it should land crisply), and stays.

**The CTA button — "LET'S MAKE IT REAL":**
- Size: height 64px (56 mobile), padding 0 40px, Archivo 800 16px uppercase, tracking 0.06em, bg `--red`, text `--obsidian`, radius 2px, glow below `0 18px 50px -12px var(--red-glow)`.
- Tactile: on hover → lifts 3px, glow intensifies, a thin ice sheen sweeps across left→right (500ms); text letters do a 1-line roll (old text slides up, same text slides in from below). On press → translates down 2px, bg `--red-deep`, glow shrinks (`--dur-micro`). Magnetic pull toward pointer within 80px (max 10px offset, desktop).
- Focus-visible: 2px ice outline offset 4px.

**Contact reveal (T5):** click → the button **splits**: it shrinks into a slim label "CHOOSE A CHANNEL" and two option buttons slide up from it side by side (stacked on mobile), stagger 90ms:
- **EMAIL** — ice outline button, icon + "EMAIL". Opens `mailto:RanaHasi302@gmail.com?subject=<encoded "Project inquiry — via HASI DESIGNS">&body=<encoded "Hi Hussnain,%0D%0A%0D%0AI'd like to talk about a project.%0D%0A%0D%0AName:%0D%0AWhat I want to build:%0D%0ATimeline:%0D%0A">`.
- **WHATSAPP** — ice outline button, icon + "WHATSAPP". Opens `https://wa.me/923141481275?text=<encoded "Hi Hussnain, I found HASI DESIGNS and I'd like to talk about a project.">` in a new tab.
- Below both: mono 11px "or copy: RanaHasi302@gmail.com" with a copy button (copies, shows "COPIED" for 1.6s).
- A small "×" (or Esc / outside click) collapses back to the CTA.
Hover on options: border turns red, label slides 4px right, arrow ↗ appears.

**Mobile composition:** ME.png height ~70svh, statements above his head (2 lines max each), CTA at 72svh, options stacked full-width (max 360px).

---

## 10. Component states (all interactive elements)
default · hover · focus-visible · active/pressed · disabled (40% opacity, no pointer) · loading (mono "…" pulse) · success (brief check) · error (red hairline + message). Every state defined for: CTA, option buttons, copy button, tools, plates, open-project button, panel close, nav links, scene index items.

---

## 11. Reactions to the environment

| Change | Reaction |
|---|---|
| Resize / orientation change | Debounced 150ms: recompute ScrollTrigger (`refresh`), re-layout 3D camera FOV/positions for new aspect, keep current scene and progress (no jump to top). |
| Tab hidden | Pause render loop, pause Lenis RAF, pause CSS loops. Resume on visible. |
| `prefers-reduced-motion: reduce` | Lenis off, no pinning-scrub animations — scenes become stacked static compositions with 400ms fades on enter, no parallax, no cursor, no particles, CTA appears without travel. |
| `prefers-contrast: more` | Secondary text → full ice, hairlines → `--ice-30`. |
| Save-Data / slow network | Lite tier (Security.md §5). |
| Pointer = coarse | No custom cursor, hover → tap, magnetic off. |
| Keyboard navigation | Visible focus everywhere; Tab order follows reading order; Skip link "Skip to contact" first in DOM. |
| Low FPS detected (avg < 40fps over 2s) | Step down one quality tier automatically (once per session, never flip-flop). |
| WebGL context lost | Switch to DOM fallbacks for that scene without reload (Security.md). |

---

## 12. Iconography & imagery
- Brand logos: **Simple Icons** SVGs (only real logos; if a logo is missing from the library, render the tool name as an Archivo monogram tile — never draw an imitation).
- UI icons (arrow ↗, ×, copy, mail, WhatsApp): **Lucide** at 1.5px stroke, or simple-icons for the WhatsApp brand mark.
- Only image of the creator: ME.png (Scene 06). No stock photos. No AI-generated images of the creator.

---

## 13. Responsive design (every screen size)

Mobile-first. Designed per size, not just shrunk.

| Range | Name | Key adaptations |
|---|---|---|
| < 380px | XS phone | Mega type 34vw allowing crop; single column; Scene 03 visuals simplified; CTA full-width minus margins. |
| 380–639 | Phone | 4-col grid; 2.5D toolkit; vertical chapters; vertical plates; top progress bar replaces scene index. |
| 640–1023 | Tablet / large phone landscape | 8-col; toolkit 3D if tier ≥ mid; chapters vertical in portrait, horizontal in landscape. |
| 1024–1439 | Laptop | Full experience. |
| 1440–1919 | Desktop | Full experience, larger margins. |
| ≥ 1920 | Large / ultrawide | Content max-width 1760px centered for text blocks; giant type and 3D still fill the screen; never stretched layouts. |
| Height < 500 (landscape phones) | Short | Reduce pin lengths ×0.7, hide scroll cue, statements max 2 lines, ME.png height 90svh. |

Also: test portrait + landscape, notch/safe areas, iOS Safari dynamic toolbar (use `svh`), Android Chrome, foldables (use container queries for chapter layouts), and 200% browser zoom (layout must not break).
