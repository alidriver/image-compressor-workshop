# Compare and compress — versions workshop

A multi-version React playground. Each version lives in its own folder under [src/versions/](src/versions/), and the homepage lists them as cards. Designed for designers to vibe-code with Claude.


## Working with versions

The homepage lists every folder under [src/versions/](src/versions/) as a card. To add a new version:

- **In the Claude sidebar:** type `/new-version` (or just say "create me a new version") — Claude will ask for a name and scaffold the folder.
- **By hand:** `cp -r src/versions/_skeleton src/versions/<your-slug>`, then edit `meta.ts`.

Each new version ships with a `PRD.md` template. Open it, replace the bracketed placeholders with what you want to build, then ask Claude *"build this version from the PRD"*.

## Other commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server (skips install) |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

## Requirements

- Node 20+ (tested on 24)
- npm 10+

## What's wired up

- **Hash-routed homepage** in [src/App.tsx](src/App.tsx) — auto-discovers versions via `import.meta.glob`, shows last-edited time and PRD status.
- **Skeleton template** at [src/versions/_skeleton/](src/versions/_skeleton/) — copied for every new version. The leading underscore excludes it from the homepage.
- **`/new-version` slash command** at [.claude/commands/new-version.md](.claude/commands/new-version.md).
- **Tailwind v4** via `@tailwindcss/vite`, theme in [src/index.css](src/index.css).
- **shadcn/ui** primitives in [src/components/ui/](src/components/ui/), config in [components.json](components.json) — shared across versions.
- **Available libraries for versions:** Squoosh WASM encoders (`@jsquash/*`), `react-compare-image`, `react-easy-crop`, `react-zoom-pan-pinch`, `fabric`, `jszip`, `lucide-react` icons.
