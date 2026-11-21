# reference.md — HASI DESIGNS · References & Resources

> What to look at, what to take from it, what to never take, and the exact names of every resource.

---

## 1. Provided files (exact names)

| File | Location | What it is | How it is used |
|---|---|---|---|
| `Video.mp4` | `_brief/assets/Video.mp4` | Screen recording of a third-party cinematic portfolio (the inspiration) | **Study only.** Never shipped, never embedded, never served. |
| `ME.png` | `_brief/assets/ME.png` | Hussnain's own black-and-white rim-lit silhouette portrait on a light grey background | The **only** image of the creator. Background removed (Phase 3) → `public/me/*`. Used **only in Scene 06**. |
| Spec files | `_brief/*.md`, `_brief/prompt.txt` | This specification | Source of truth. |

The **colour palette** is defined in Design.md §2 (originally from a brand palette board: Obsidian Black `#111217`, Ice Grey `#DFE5EB`, Racing Red `#EF233C`, shown on posters using rim-lit silhouettes, a bold red diagonal and large lettering). Those poster principles are part of our design language.

**No other inspiration references.** Do not search for or use other websites as design references.

---

## 2. How to study `Video.mp4`

1. Extract frames: `bash scripts/extract-reference-frames.sh` → e.g. `ffmpeg -i _brief/assets/Video.mp4 -vf "fps=2,scale=960:-1" /tmp/ref/frame_%03d.jpg` (output in `/tmp`, never committed). Also review it at full speed for rhythm.
2. The website shown inside the video is visible on a monitor/laptop in a dark room — focus on the **website**, ignore the room, the desk, the captions ("Want a cinematic portfolio…", "Comment link…") and the AI-tool icons overlay.
3. Write findings in `docs/REFERENCE_ANALYSIS.md` using the table below.

### TAKE (principles)
- **Oversized background typography** used as architecture — a giant word dominating the frame with the subject layered in front of / overlapping it.
- **Cinematic pacing:** each scene is a composed frame; scroll moves between compositions rather than scrolling a long page.
- **Dark environments with a single warm/strong light accent** and atmospheric particles/light streaks.
- **Floating tool icons in 3D space** around a central anchor with depth and slight rotation (Scene 02 idea).
- **Projects as a spatial gallery** of large image panels with depth rather than a flat grid.
- **Arc / timeline-like sweeping light paths** as motion accents (use sparingly, in red).
- **Bold full-bleed colour-plane transitions** between sections (our version: THE RED CUT).
- The **overall rhythm**: calm reveal → dense interactive middle → minimal, powerful final frame.

### DO NOT TAKE
- The name, wordmark or any text from the video (e.g. the creator's name shown there, "Welcome to my world", "The Creative Universe", "A Journey Through Time").
- Its orange/warm colour grading, beige/yellow walls, the sports car scene, or any of its imagery, characters, people or photos.
- The 3D walking character concept — HASI has **no character before Scene 06** and no walking figure at all.
- Its exact layouts, icon set (e.g. Adobe app icons), timeline-by-year section, or work-experience timeline.
- Any asset from the video (never screenshot it into the site).

---

## 3. Libraries (exact package names)

| Purpose | Package |
|---|---|
| Framework | `next`, `react`, `react-dom` |
| Language | `typescript` |
| 3D | `three`, `@react-three/fiber`, `@react-three/drei` |
| Scroll animation | `gsap` (incl. `ScrollTrigger`) |
| Smooth scroll | `lenis` |
| UI motion | `framer-motion` |
| State | `zustand` |
| Styling | `tailwindcss` (+ its PostCSS setup) |
| Brand logos | `simple-icons` |
| UI icons | `lucide-react` |
| Screenshots (dev only) | `playwright` |
| Background removal (script, Python) | `rembg` (+ `Pillow`) |
| Bundle analysis (dev) | `@next/bundle-analyzer` |

Use latest stable versions at build time. No other runtime dependencies without recording why in DECISIONS.md.

## 4. Fonts (Google Fonts via `next/font/google`, all OFL)
- **Archivo** (variable — weight + width axes) — display
- **Geist** — text
- **Geist Mono** — mono labels
- 3D text: Archivo heavy weight converted to `public/fonts/archivo-black.typeface.json` (facetype.js format).

## 5. Brand logos (Simple Icons slugs — verify each exists; if missing, use an Archivo monogram tile)
`claude` (or `anthropic`), `openai` (ChatGPT), `figma`, `visualstudiocode`, `github`, `openjdk` (Java), `javascript`, `typescript`, `react`, `nextdotjs`, `html5`, `css` (or `css3`), `tailwindcss`, `python`, `vercel`, `supabase`, `linux`, `whatsapp`, `instagram`, `gmail` (optional).
Logos are trademarks of their owners and are used only to indicate tools used. Do not modify their shapes.

## 6. External URLs (the only ones allowed in the site)
- Dollar Store POS — `https://dollar-store-sable.vercel.app/#/sell`
- Goods Transport Company POS — `https://rstg.vercel.app/`
- GitHub — `https://github.com/HASI-desings`
- Instagram — `https://instagram.com/hussnain_7979`
- WhatsApp — `https://wa.me/923141481275`
- Email — `mailto:RanaHasi302@gmail.com`
