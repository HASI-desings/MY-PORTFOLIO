# Reference Analysis — `_brief/assets/Video.mp4`

> Phase 1 deliverable. What the inspiration video teaches, what HASI DESIGNS takes from it (principles only), and what it never takes.
> Rules.md §2.7 and reference.md §2 govern this file: **principles in, assets/layouts/names/colours out.**

---

## 0. Source and method

| | |
|---|---|
| File | `_brief/assets/Video.mp4` — 34.4 s, 464×832 portrait, 30 fps, H.264 + AAC |
| What it is | A phone recording of a third-party portfolio running on a desktop monitor and a laptop in a dark room |
| Ignored | The room, desk and laptop bezel, the caption overlay ("Want a cinematic portfolio…", "Comment 'link'…") and the AI-tool icon row |
| Method | `scripts/extract-reference-frames.sh` → 69 frames at 2 fps, 9 timestamped contact sheets, plus monitor-only crops at 14 key moments. Also reviewed at full speed for rhythm. Output kept in the session scratchpad — **never committed** (Rules.md §8.6) |

---

## 1. The film, second by second

| Time | Beat | What the site does | Camera / motion | Light |
|---|---|---|---|---|
| 0.0–1.5 | Arrival | Almost empty dark room; one small element fades in at centre | Static | One soft key from the right, everything else in shadow |
| 1.5–3.0 | Name build | A coloured block grows **from behind the centre** and opens into a giant condensed name; a tiny tracked label sits above; chrome fades in at the edges last | Type scales up from the centre | The type carries all the colour |
| 3.0–6.0 | Hero hold | Giant name fills ~85 % of the width, cropped by the frame; the subject is layered **in front** of the letters | Near-static, long hold | — |
| 6.0–6.6 | Transition | Name slides down and out while the next scene's objects rise from below — a vertical crane move | ~0.6 s | — |
| 6.6–15.0 | Tool universe | Dark 3D room; a central anchor; dark tiles with tool logos float at different depths with slight rotation; **one** fast light streak loops around the anchor; sparks/bokeh | Tiles drift slowly; the streak is the only fast thing | One warm key + the streak |
| 15.0–16.0 | Transition | Camera tilts down past more tiles to a reflective floor, fades to black | Tilt + fade | — |
| 16.0–21.0 | Timeline | A light arc draws itself; markers rise along it | A glow point travels the arc | — |
| 21.0–23.5 | Transition | Camera descends to floor rings → near-black with dust and a single light point | Descend + fade | — |
| 23.5–28.0 | Work | Many image panels in a curved spatial gallery around a central platform, each at its own angle/depth | Slow push-in | — |
| 28.0–30.0 | Colour transition | Camera dives into the platform, then a **full-bleed colour flood** (vertical smear) resolves into giant lettering | ~1.5 s | Colour floods the frame |
| 30.0–32.0 | Portrait hero | Giant name again, portrait in front, small side text | Hold | — |
| 32.0–34.4 | Finale | Hard **diagonal colour split** across the frame, subject in front — a poster | Static hold | — |

---

## 2. Rhythm (the most useful lesson)

- **6 compositions in 34 s.** Holds of 4–9 s, transitions of 0.5–1.5 s → roughly **5 : 1 hold-to-transition**. You remember the held frames, not the moves.
  → HASI: long pinned holds (220–320 svh), short sharp transitions (RED CUT ≈ 40 vh of scroll).
- **Energy curve:** calm arrival → dense interactive middle → still poster finale.
  → HASI: Scene 01 calm → Scenes 02–04 dense → Scene 05 pure type → Scene 06 still, one button. (Matches App.md §3.)
- **Only 1–2 things move at once.** In the tool universe the tiles barely drift while one streak is the fast element.
  → HASI: Design.md §7 stagger rules; in Scene 02 the tools idle while the entering/hovered tool is the only fast motion.
- **Chrome arrives last** in the hero and stays at the edges, so the centre is always the composition.
  → HASI: loader → letters → name block → chrome; all chrome pinned to edges (Design.md §6).

---

## 3. TAKE — principles and exactly where they land

| # | Principle seen in the video | Seen at | HASI translation (already in the spec — nothing added) | Where |
|---|---|---|---|---|
| 1 | **Oversized type as architecture**, cropped by the frame edges | 1.5–6 s, 30–32 s | 3D extruded **HASI** standing in the room as a lit structure — no person | Scene 01 |
| 2 | **The name is built, not faded in** — it grows from the centre | 1.5–3 s | Loader HASI outline **fills bottom→top with real progress**, then hands off to the Scene 01 letters | Loader → 01 |
| 3 | **Scroll moves between composed frames**, not down a long page | whole film | Pinned scenes, one idea per viewport | All |
| 4 | **Dark room + one strong light accent + faint atmosphere** | 6–15 s | Obsidian room, cool ice key light, thin red rim, low haze, ≤ 400 slow dust motes | 01, 02 |
| 5 | **Floating tool tiles at different depths around a central anchor** | 6.6–15 s | 17 brushed-metal tiles in three asymmetric depth rings around **the Core** monolith (abstract, not a person) + Full Dev | Scene 02 |
| 6 | **One sweeping light as the moving accent** — used sparingly | 8–14 s, 16–21 s | Key light **rakes across the HASI faces** (01); vertical **light beam** sweeps the philosophy line (05); red pulses travel graph edges (03). Red, sparse, never an orbiting fire streak | 01, 03, 05 |
| 7 | **Work as a spatial gallery with depth** | 23.5–28 s | Five real project **plates on a dark surface** in perspective that **lift** on intent — a row, not a dome | Scene 04 |
| 8 | **Full-bleed colour transition** between acts | 28.5–30 s | **THE RED CUT** — one sharp −18° red plane sweeping across, clean geometry instead of a smear | 01→02, 03→04, 05→06 |
| 9 | **Diagonal colour-split poster** as the last frame, subject in front of huge type | 30–34 s | Scene 06: ME.png rises, statements behind his head/shoulders, red diagonal low, CTA rises over the portrait | Scene 06 |
| 10 | **Camera moves carry you between scenes** (crane, tilt, dive) | 6 s, 15 s, 21 s, 28 s | **Depth push** (dolly forward through the outgoing scene) | 02→03, 04→05 |
| 11 | **Loading starts on a nearly empty dark frame**, one element arrives | 0–1.5 s | Loader: empty obsidian + HASI outline + real counter | Loader |
| 12 | **Thin edge chrome** keeps the centre free | 3–6 s | Wordmark top-left, scene index right, LET'S TALK top-right, IG bottom-left | Global |

---

## 4. DO NOT TAKE — explicitly excluded

| From the video | Why it stays out | HASI instead |
|---|---|---|
| The creator's name/wordmark and every line of its copy (its welcome line, universe title, journey title, slogan, menu items) | Someone else's identity | Only App.md §2 facts |
| Orange/amber/yellow grading, cream/beige field in the finale, sepia photo cards, green/blue imagery | Outside the HASI palette | Obsidian / Ice / Racing Red only |
| A person in the hero and throughout (front figure, back-view figure in the tool room, figure on the platform) | Rules.md §2.6 — the creator is held back until Scene 06 | HASI lettering (01) and the Core (02) carry presence |
| Walking/standing 3D character | reference.md §2 — no character at all | — |
| Smoking pose, sunglasses portrait, sports car and its brand logo | Imagery not ours | ME.png only, Scene 06 only |
| Serif display type, grunge-textured letter fill | Fonts and materials are fixed | Archivo / Geist / Geist Mono; matte + brushed metal |
| Adobe-style app icons and tools Hussnain doesn't use | Never invent skills/tools (Rules.md §1.1) | Only the 17 listed tools + Full Dev |
| Year-by-year timeline arc, clock dial, experience history | Not in the brief; would imply invented history | — |
| Dome of dozens of project panels with invented titles | Fabrication | 5 real projects, honest status |
| Melting/dripping colour smear | Not our language | RED CUT: sharp, geometric, −18° |
| Spark explosions, bokeh bursts, orbiting fire streak | Effects without meaning (Design.md §1.7) | Quiet dust, one raking light |
| Its layouts, nav, side-text columns, framing; any frame or asset | Rules.md §2.7, §8.6 | Our grid and chrome per Design.md |

---

## 5. What the video gets wrong — and our spec already fixes

- **Small text over busy 3D is hard to read** (side labels in the tool room) → Security.md §8 scrim rule: a darkened zone behind any body text, ≥ 4.5 : 1.
- **Colour does all the work** (everything is orange) → in HASI red stays a signal so the red CTA is the loudest thing on the last screen.
- **Everything is a figure** → in HASI the person appears once, which makes the final reveal land.

---

## 6. Spec contradictions & open questions

Full list with my proposed resolutions is in `docs/DECISIONS.md`. The four that need the owner:

1. **Red area.** Rules.md §2.1 caps red at ~3 % of any static frame and Design.md §1.3 says red is never a large surface — but Design.md §9 gives Scene 01 a red plane "covering ~25 % of the frame" and Scene 06 "a large red diagonal plane". Rules.md wins by hierarchy. **Proposal:** both planes become sharp −18° **blades** (~3–4 % of the frame); red only goes big during THE RED CUT. Reason: if a quarter of the screen is red, the red button and red hover states stop being signals.
2. **Branch.** The brief says commit to `main`; this session is configured to push to `claude/admiring-darwin-hl60ks`. Phase 0 is pushed there. Push directly to `main` from now on, or keep the branch and merge when ready?
3. **Full Dev numbers.** Design.md's panel copy says "67 curated skills"; the Full Dev README now says **95 bundled skills (was 67)**. Publishing 67 would be out of date. **Proposal:** use 95.
4. **Portrait resolution.** The only copy of ME.png is the chat-attached 1122 × 1402 image. Structure.md expects `me-1600.*`, and upscaling is forbidden. On a 2× laptop at ~88 svh the portrait needs ~1580 px of height, so it will be slightly soft. If the original full-resolution photo exists, upload it; otherwise I export at native size.
