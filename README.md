# HASI DESIGNS

The cinematic, scroll-controlled portfolio of **Hussnain Sohail** — software engineering student, developer and digital creator from Lahore, Pakistan.

> Work in progress. The build follows `_brief/Phases.md`; current status is in `docs/PROGRESS.md`.

## Run locally

Requires Node.js 24 (see `.nvmrc`; any Node ≥ 20.9 works).

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates Next.js route types, then `tsc --noEmit` |
| `npm run format` | Prettier |
| `npm run assets:portrait` | Rebuilds the portrait set in `public/me/` from `_brief/assets/ME.png` |
| `npm run assets:screens` | Captures screenshots of LIVE project URLs |
| `npm run analyze` | Turbopack bundle analyzer |

## Where things live

- `_brief/` — the specification and the original assets (read-only).
- `src/content/` — **all** personal content (text, tools, disciplines, projects). Edit here; animation code never needs to change.
- `docs/` — progress, decisions, reference analysis, QA report.

## Deploy

Not deployed from this repository's tooling. To deploy on Vercel: import the repo, framework **Next.js**, no environment variables needed.
