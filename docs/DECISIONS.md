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
