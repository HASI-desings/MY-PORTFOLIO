# Identity & Creative Requirements: Hussnain Sohail Portfolio

_Status: **draft v2** (2026-11-20), awaiting approval._ Items marked **[proposal]** are my inferences. You did not state them.

---

## What he does
Hussnain Sohail is an independent **designer-engineer** based in Lahore. He runs the personal studio HASI Designs, founded ProSol, and studies BS Software Engineering at UCP. He takes a client's idea through concept, UI/UX, frontend, backend, database and deployment to a shipped product, and he does all of it himself. He works in six genres: web experiences, web apps/SaaS, desktop software, mobile apps, AI-integrated products, and automation/trading tools.
**Business model [proposal]:** client projects found through direct referral, LinkedIn, Fiverr and Upwork. The portfolio is the conversion point for all of these channels.

**The problem he solves for clients:** with most freelancers, a client has to hire a designer, a developer and someone to deploy, and then coordinate between them. Hussnain is one accountable person who has taste and also ships working software.

## Audience
**Decided:** International and Pakistani clients are **equal priority**. The brief form offers a **USD / PKR** currency switch, and both **email and WhatsApp** are contact channels.

| Segment | Who exactly | Context & device | What they need from the site |
|---|---|---|---|
| A · International clients | Founders and small-business owners who arrive from Upwork, Fiverr or LinkedIn. Budget roughly $500–5k per project | Desktop at work, then a phone re-check | Proof of quality in seconds, trust that he finishes, an easy way to start |
| B · Pakistani brands & SMEs | Lahore/Karachi businesses that want to look premium without paying agency prices | **Budget Android on 4G**, often from WhatsApp links | A site that loads fast on *their* phone. That speed is the proof |
| C · Studios & agencies | Teams looking for a creative developer for motion or 3D work | Desktop, curious, inspecting the build | Craft details, smoothness, how it was built (Full Dev) |
| D · Developers & peers | People who find him through the Full Dev repo | Desktop, GitHub tab open | Credibility of the engineering mind behind the tool |

Segments A and B weigh the same. Segment B also shapes the build: **the site has to prove his "fluid on budget phones" claim on the very phone the client is holding.**

## Differentiation
- **One person, end to end.** Most local portfolios are either "designer" or "developer". He is genuinely both, and the site has to show that through how it is made.
- **He engineers his own process.** Full Dev is an open-source system he built. Few freelancers at any level can point to their own tooling.
- **Performance as a value, not a footnote.** A heavy 3D world that still runs on a cheap phone is the argument in itself.
- **[proposal] Self-proving site.** The site can show its own *real* runtime facts in T3/T4: the quality tier it picked for your device, the bytes it loaded, and the frame rate it is holding. These are live numbers measured at runtime, which keeps them within the "no fake stats" rule.

## Personality
| Is | Is not |
|---|---|
| Inventive | Gimmicky (effects that don't mean anything) |
| Precise | Cold or sterile |
| Confident | Arrogant or hype-driven |
| Warm (a good person to work with) | Casual or unprofessional |
| Fast | Rushed or unfinished |

## Emotions & impression
- **Visitors should feel:** a moment of wonder, then trust. "How did one person build this?" turns into "I want him on my project."
- **In 5 seconds they should understand:** his name, that he designs *and* builds products, and that they can start a project now.

## Actions
- **Primary:** Start a project (the T5 brief flow).
- **Secondary:** Explore Full Dev on GitHub · reach him directly (email/LinkedIn) · browse genres and capabilities.

## Ambitions **[proposal]**
- **Short term:** win the first serious clients through this site and establish HASI Designs as a studio name.
- **Long term:** grow from a one-person studio into a product/tech company. The site architecture (content file, projects module) has to scale into a studio site without a rebuild.

## Requirements (MoSCoW)
- **Must:** a scroll-driven 3D world (camera travels, sections are places) · the five visibility tiers T1–T5 driven from one content file · a semantic HTML layer that holds all content · a loader that belongs to the world, with real progress · device tiers (high/med/low), capped DPR, rendering paused when off-screen or hidden · no-WebGL and reduced-motion versions · an error boundary per scene · a T5 project-brief form (Zod, spam protection, designed states) · a data-driven projects module that launches in an "in the workshop" state · SEO, OG image, sitemap, robots · deployment on Vercel.
- **Should:** cursor-reactive depth on desktop · touch- or scroll-reactive depth on mobile · ambient sound, off by default · privacy-friendly analytics · T4 panels that close with the back gesture.
- **Could:** gyroscope depth (opt-in, see flag 4) · the live performance readout · Urdu-language touches.
- **Won't (now):** a CMS, a blog, case-study pages (the architecture will be ready for them), multiple languages, payments.

## Constraints
- **Budget:** student budget, so free tiers (Vercel Hobby, Supabase free tier, free email-service tier).
- **3D asset pipeline:** no 3D artist and no Blender pipeline in this environment. See flag 3.
- **Maintainer:** Hussnain edits content later without touching 3D code, which means one content file.
- **Persistence:** this cloud workspace is temporary, so the project needs a GitHub repo to push to early (see open questions).
- **Domain:** unknown.

## Feasibility flags: conflicts I'm raising now, with the better move
1. **Lighthouse ≥ 90 vs. a heavy 3D world.** On desktop, 90+ is achievable. On mobile, a WebGL world will cost points. **Better move:** the T1 content (name, one-liner, CTA) is real HTML and paints immediately as the LCP element. three.js and the scenes load *after* first paint. With that setup, mobile can realistically score in the high 80s to 90s. I'll report what we actually measure.
2. **A full-screen preloader would hurt LCP and accessibility.** A loader that hides the page delays LCP and keeps screen readers waiting. **Better move:** T1 text is readable from the first frame. The loader lives in the world layer *behind and around* it: the world assembles itself while you're already reading his name, and the progress it shows is real.
3. **Draco/KTX2 assets with no modelling pipeline.** **Better move:** build the world mostly from **procedural and instanced geometry plus custom shaders**. That is tiny to download and plays to his engineering strength. glTF (Meshopt) and KTX2 are only for the one or two hero objects that need modelled detail, generated or optimized with gltf-transform.
4. **Gyroscope on iOS needs a permission prompt** (a system dialog after a tap). **Better move:** the default mobile depth comes from touch and scroll, and gyro is an opt-in toggle. No surprise dialogs.
5. **Fiverr/Upwork links on a premium site** can anchor clients toward gig-level prices. **[proposal]** Keep them out of T1/T2 and offer them in T5 as "also on" channels for people who prefer marketplace protection.
6. ~~Full Dev numbers.~~ **Decided:** Full Dev is presented exactly as the brief describes it. Its copy lives in the content file, so it can be edited later without touching code.
7. ~~Name collision.~~ **Decided:** the site is branded **Hussnain Sohail**. HASI Designs appears inside the site as his studio, which avoids the Dribbble name collision and the "desings" spelling.

## Competitors reviewed
I searched the category of Lahore and Pakistan freelance designer-developers (Dribbble, Truelancer, Twine and Freelancermap profiles) rather than individual named sites.
| Pattern | What they communicate | Visual cliché |
|---|---|---|
| "Full Stack Developer \| Next.js \| GSAP \| Tailwind" headlines | A stack, not a person or an outcome | Tech-logo grids, skill-percentage bars |
| Agency-style freelancer pages | "We do everything" | Dark background + neon gradient, glass cards, laptop mockups |
| Marketplace profiles | Price and speed | Fake counters ("150+ projects"), stock photos |

## Industry clichés to avoid
- "Hi, I'm Hussnain 👋", typewriter role rotators, skill % bars, scrolling tech-logo marquees, count-up stats.
- Engineer = **circuit boards, matrix rain, terminal windows, floating code editors, 3D laptops**.
- Designer = **pen tools, Figma frames, colour swatches** as decoration.
- 3D portfolio = **space, astronauts, planets, floating low-poly islands, blob gradients**.
- "Every problem has a better move" = **a literal chessboard and knight**. That is the obvious first idea, and Phase 2 must beat it or radically subvert it.
- Pakistan → global = **truck-art pastiche, a green-crescent palette, landmark silhouettes, a spinning globe with flight arcs**. The origin should be felt in material, rhythm or craft, never stamped on as a symbol.
- Anything a visitor could trace back to igloo.inc or landonorris.com.

## Anti-goals: failure even if it technically works
- It stutters on a budget Android. That disproves his main claim.
- The world impresses but the visitor can't say what he does after 5 seconds.
- It feels packed: more than one main idea on screen at once.
- Content exists only in WebGL (invisible to screen readers and Google).
- Any fake number, fake project, dead button or lorem ipsum.
- Someone recognizes it as "the igloo one" or "the Lando one".
- The contact flow loses a lead (an error with no recovery, a silent failure).

## Open questions
1. **ProSol:** what is it, and should it appear on the site?
2. Contact placeholders (EMAIL / LINKEDIN / FIVERR / UPWORK / **WHATSAPP**), needed before Phase 6.
3. A portrait photo: yes or no? **[proposal]** None in T1; optional in the About panel (T4).
4. Domain: do you own one?
5. Contact backend (Supabase or an email service): you asked me to raise this before wiring, so I'll come back to it in Phase 4.

**Resolved:** site brand (Hussnain Sohail) · audience (both equally) · Full Dev copy (as in the brief) · project repo (`HASI-desings/my-portfolio`).

_Sources: [Hasi Design Studio on Dribbble](https://dribbble.com/hasidesign_studio) · category scan via [Truelancer](https://www.truelancer.com/freelancer/alishbashahzad18), [Freelancermap](https://www.freelancermap.com/profile/muhammad-f), [Twine](https://www.twine.net/user1642917), [Dribbble](https://dribbble.com/developer_noon/about)._
