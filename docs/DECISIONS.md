# Decisions

> Every deviation from, or interpretation of, the `_brief/` spec — with the reason. Newest at the bottom.
> Status: **OPEN** = needs the owner · **DECIDED** = taken, owner informed at the next stop.

---

### D-001 · Branch — OPEN
- **Spec:** Rules.md §8.1 / Phases.md — commit and push to `main`.
- **Reality:** this cloud session is configured to develop and push on `claude/admiring-darwin-hl60ks`, and pushing elsewhere needs explicit permission.
- **Now:** all work is pushed to `claude/admiring-darwin-hl60ks` (it was fast-forwarded to `main` first, so it contains your deletion of the old files).
- **Ask:** push directly to `main`, or keep the branch and merge it into `main` when you are ready?

### D-002 · ME.png source — DECIDED
- The only copy available is the image attached in chat (WebP, 1122 × 1402, RGB with ICC profile).
- Saved to `_brief/assets/ME.png` as a **lossless** PNG conversion, verified pixel-identical to the attachment. No other change.
- Resolution concern raised as open question in REFERENCE_ANALYSIS.md §6.4.

### D-003 · Red area in Scenes 01 and 06 — OPEN (proposal)
- **Conflict:** Rules.md §2.1 (red ≤ ~3 % of a static frame) and Design.md §1.3 (never a large surface) vs Design.md §9 Scene 01 (red plane ~25 % of frame) and Scene 06 ("large red diagonal plane").
- **Hierarchy:** Rules.md wins.
- **Proposal:** render both as sharp −18° blades of ~3–4 % visible area. Red becomes large only during THE RED CUT. Keeps the CTA and active states as the only loud red.

### D-004 · Full Dev panel numbers — OPEN (proposal)
- Design.md says "67 curated skills". The Full Dev repository README (checked in this session) says "**95 bundled skills** (was 67)", 13 phases, a design-intelligence engine and an anti-generic checklist.
- **Proposal:** publish "95". Rules.md §1.1 forbids publishing a fact we know is out of date.

### D-005 · Missing Simple Icons — DECIDED
- Checked against `simple-icons@16.38.0`: **`openai` (ChatGPT) and `visualstudiocode` no longer exist** in the library. `claude`, `figma`, `github`, `openjdk`, `javascript`, `typescript`, `react`, `nextdotjs`, `html5`, `css` (not `css3`), `tailwindcss`, `python`, `vercel`, `supabase`, `linux`, `whatsapp`, `instagram`, `gmail` exist.
- Per Design.md §12: ChatGPT and VS Code are rendered as **Archivo monogram tiles** with their names. No imitation logos are drawn.

### D-006 · Network for Phase 3 — DECIDED (action at Phase 3)
- This container's network policy blocks `dollar-store-sable.vercel.app`, `rstg.vercel.app` (proxy 403) and GitHub release downloads (where `rembg` fetches its model). npm, PyPI and Google Fonts are reachable.
- At Phase 3 I will ask (through the environment approval prompt) to allow the two project hosts so real screenshots can be captured. If declined: typographic covers, per Phases.md §3.2 — never a fake screenshot.
- If the `rembg` model cannot be downloaded: the spec's fallback (luminance/colour-distance key with edge feathering). The portrait is a near-black silhouette on light grey, which suits a luminance key well. Shown for approval at Stop 2.

### D-007 · 3D typeface source — DECIDED
- The 3D HASI is generated from **Archivo variable instanced at wght 900 / wdth 125** (fontTools), not from the separate "Archivo Black" family.
- Reason: the loader's DOM letters and the 3D letters must be the same shapes for the shared-element handoff to be seamless (Design.md §9 Loader).

### D-008 · CSP in development — DECIDED
- Security.md §2 CSP is applied in production builds only. Next.js dev mode needs `eval` for fast refresh; production stays exactly as specified.

### D-009 · Device-orientation parallax on iOS — DECIDED
- iOS only grants motion sensors after a permission tap, and no such prompt is in the spec. Adding one would add UI that wasn't asked for.
- Gyro parallax works where no prompt is needed (most Android browsers). iOS gets no parallax, which Design.md already allows ("else none").

### D-010 · Anti-generic checklist vs the brief — DECIDED
- The full-dev anti-generic checklist flags some items the brief deliberately chooses: near-black + one red accent, mono labels, "02 — TOOLKIT" labels, 01–06 numbering, the CTA sheen, plate tilt and dust particles.
- The checklist itself says these are fine **when the brief chooses them**. They stay, but only where the spec puts them. The 01–06 numbering is a real sequence (scenes of a film).

### D-011 · Grain on the `mid` tier — DECIDED
- Design.md §6 disables grain on `low`; Security.md §5 only says "grain on" for `high`. `mid` keeps grain (it's a static texture and costs almost nothing).
