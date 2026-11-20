# Phase 1: Identity & Creative Requirements, Hussnain Sohail Portfolio

_Status: **APPROVED** (2026-11-20), with one change: the signature tool is removed from the site._

**Rule for this document:** every line either comes from your brief (cited as §section) or from an answer you gave. Nothing is invented. Anything not stated in the brief is listed under **Open items**.

---

## 1. Who he is (§1)
- **Name:** Hussnain Sohail
- **Brands:** Founder of ProSol · personal studio HASI Designs
- **Base:** Lahore, Pakistan · BS Software Engineering student at UCP
- **One-liner:** "A designer and engineer in one person — I take an idea all the way to a shipped product."
- **Philosophy:** "Every problem has a better move."

**Genres (6):** Web experiences (brand sites, storefronts, landing pages) · Web applications & SaaS (dashboards, platforms, PWAs) · Desktop software (offline-first business tools) · Mobile apps (cross-platform Android & iOS) · AI-integrated products (assistants, insights, voice) · Automation & trading tools (bots, extensions, Expert Advisors).

**What he delivers (10):** Design · Motion · Range · Performance · Realtime · Security · Reliability · AI · Speed · Shipping. The full wording from §1 is kept verbatim for the content file.

**Toolkit (19):** Next.js · React · TypeScript · Tailwind · GSAP · Framer Motion · Three.js · Supabase · Appwrite · Electron · Tauri · React Native (Expo) · Python · Java · MQL5 · Vercel · GitHub · Figma · Claude Code.

**Projects:** not a focus yet. The architecture is data-driven from one file and launches with an "in the workshop" state: no empty grid, no fake projects.

## 2. Decisions you have made
| Item | Decision | Source |
|---|---|---|
| Site name/brand | **Hussnain Sohail** | your answer |
| Audience | **International and Pakistani clients, equally** | your answer |
| Signature tool (Full Dev) | **Not mentioned anywhere on the site** | your answer at approval |
| Project repo | `HASI-desings/my-portfolio` | you attached it |

## 3. What the site must achieve
- It is the **first impression to clients** and must prove what he can build **through the experience itself** (§0).
- It must not feel template-made or like a "generic AI website" (§0).
- **Primary action:** "Start a project" (§4, T1).
- **T1 must make sense in 5 seconds** with nothing else on screen. The screen holds **one main idea at a time** (§4).

## 4. Personality: traced to the brief
| Is | Source | Must not become |
|---|---|---|
| Precise, high standard | "Apple-level standard" (§1 Design) | Cold or sterile |
| Light and efficient | "fluid on budget phones", "lightweight builds" (§1 Motion, Performance) | Heavy decoration that stutters |
| Complete, end to end | "concept … deployment — one person" (§1 Range) | "Does everything" vagueness |
| Fast | "idea to working product in days" (§1 Speed) | Rushed or unfinished |
| Original | "no template feel" (§0) | Gimmicky effects with no meaning |

## 5. Requirements from the brief
**Experience (§3)**
- A scroll-driven 3D world where scrolling moves a camera with layered depth. Sections are places or states in the world, and transitions between them are camera moves or world transformations.
- The world is a metaphor for him: builder, engineer + designer, "every problem has a better move", Pakistan → global, idea → shipped product.
- 6–7 world concepts, each with its metaphor, content mapping, hero moment, material/lighting mood and palette. **You pick one.**
- Lenis smooth scroll · GSAP ScrollTrigger timelines · cursor-reactive depth on desktop · gyro/touch depth on mobile · ambient sound, off by default, with a toggle.
- Palette, type and materials come from the concept: no dark mode + purple gradient, no stock icons, no predictable positions.

**Hierarchy (§4)**
- Tiers T1–T5 and a **Hierarchy Map** (content item → tier → trigger → location → why) for your approval before the build.
- Every T3 has a mobile equivalent. Every T4 closes with Esc, a close button and the mobile back gesture, and returns focus to where it came from.

**Loading & failure (§5)**
- A loader that belongs to the world and shows real progress, with no flash, jump or layout shift on handoff.
- The hero scene loads first; later scenes stream in. Scroll is never blocked.
- Loading, success, empty and error states for every async component.
- High/medium/low device tiers · capped DPR · rendering paused when hidden or off-screen.
- A no-WebGL 2D version · a reduced-motion version · lighter assets on slow networks · an error boundary per scene.

**Technical (§6)**
- Next.js App Router + TypeScript · R3F + drei · GSAP + ScrollTrigger · Lenis · Tailwind · Framer Motion · Vercel.
- glTF with Draco/Meshopt · KTX2 · instancing · baked lighting · actual download sizes reported.
- Lighthouse ≥ 90 on desktop and as high as possible on mobile · 60fps on desktop and mid-range Android · no layout shift after the loader · LCP < 2.5s.
- A semantic HTML layer, keyboard navigation, visible focus, enough contrast. Content never exists only in WebGL.
- Metadata, a designed OG image, a sitemap, robots.
- A contact form with Zod validation, spam protection and designed states. **The backend is your call, asked before wiring.**
- One content file holding all text and tiers · isolated scene modules · one animation/timing config.
- No fake features, no lorem ipsum, no placeholder stats.

## 6. Anti-goals (from the brief)
- Any layout, object, colour scheme, typography or signature move traceable to igloo.inc or landonorris.com (§2).
- A flat page with some 3D decoration on it (§3).
- A packed screen, or two ideas competing at once (§4).
- Hover-only information (§4).
- Content that exists only inside WebGL (§6).
- Dead buttons, lorem ipsum, placeholder stats, fake projects (§1, §6).

## 7. Conflicts with performance or accessibility, as §7 asked me to flag
1. **The preloader vs. LCP and accessibility.** If the loader covers the page, LCP waits for the 3D assets, and screen-reader users wait for nothing they need.
   **Better move:** the T1 text (name, one-liner, CTA) is real HTML, visible from the first paint, and counts as the LCP element. The world-themed loader runs in the canvas layer behind it and still shows real progress. This keeps everything §5 asks for and protects the < 2.5s LCP target.
2. **The mobile Lighthouse score with a WebGL world.** three.js plus the scenes is a heavy JavaScript bundle on a phone.
   **Better move:** load the 3D code only after first paint (dynamic import), and size the low tier for budget Android. I will report the measured score, not a promise.
3. **3D assets with no modelling tool here.** Blender is **not installed** in this workspace (checked). Draco/KTX2 compression needs source models to compress.
   **Better move:** build the world mainly from code (procedural + instanced geometry and shaders), which keeps the download very small. Use compressed glTF/KTX2 only where a modelled asset is truly needed, optimized with gltf-transform (available through npm).
4. **The gyro on iPhone.** iOS only allows motion sensors after a permission prompt triggered by a tap.
   **Better move:** touch and scroll drive the depth effect by default on mobile, and gyro turns on only if the visitor taps a toggle.

## 8. Open items and when each is needed
| Item | Needed by | Source |
|---|---|---|
| Contact placeholders: EMAIL, LINKEDIN, FIVERR, UPWORK | Before Phase 6 | §1 |
| Contact-form backend: Supabase table or email service | Before wiring (I'll ask at Phase 4) | §6 |
| The T5 form for "both audiences": budget currency, plus any other channels such as WhatsApp | Hierarchy Map (Phase 4) | your audience answer |
| Domain | Phase 12 deploy | not in the brief |

Competitor research is skipped. The brief names its references (igloo.inc and landonorris.com), and Phase 3 studies those in the browser.
