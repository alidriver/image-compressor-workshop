# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **prototyping workshop artifact**. The end user is a designer who downloaded a zip of this project and opened it in VS Code. They are likely **not an engineer**: they may have never run a Node app, used a terminal, or touched git. They drive everything by talking to Claude in the VS Code sidebar.

The project itself is a shell that hosts many siloed prototype "versions" side-by-side, so a designer can iterate without losing earlier work. Folder duplication under [src/versions/](src/versions/) is their version control — there is no git in this repo.

When you respond to the user, lean on the audience guidance in [src/CLAUDE.md](src/CLAUDE.md): plain English, lead with the visible outcome, no engineering chores unless asked.

## First run (designer just unzipped this)

If the user is asking how to start, or you can tell from context they haven't run it yet, walk them through this:

1. **Check Node is installed and recent enough.** Run `node --version`. The project needs **Node 20.19 or newer** (or 22.13+, or 24+). If Node is missing or older, point them to https://nodejs.org and tell them to install the **LTS** version, then quit and reopen VS Code.
2. **Start the dev server.** Two ways — offer the GUI path first since it's friendlier:
   - **VS Code GUI**: open the Explorer sidebar (left), find the **NPM Scripts** panel near the bottom, click ▶ next to `start`. (If the panel isn't visible, right-click the Explorer header and tick "npm".) You can also open [package.json](package.json) and click the **▶ Run Script** link that appears above `"start"`.
   - **Terminal**: open a terminal in VS Code (`Ctrl+` `` ` ``), type `npm start`, press Enter.
3. **Open the app.** Wait until output shows `Local: http://localhost:5173/`. ⌘-click that URL (or copy it into a browser).
4. **To stop:** click the trash/stop icon next to the running script, or press `Ctrl+C` in the terminal.

The first run does `npm install` first, which can take a minute or two and prints a lot of text — that's normal, not an error.

## Repo map

| Path | What it is |
|---|---|
| [src/App.tsx](src/App.tsx) | The shell: homepage that lists versions + hash router. Don't edit unless asked. |
| [src/versions/](src/versions/) | One subfolder per prototype version. **All product work happens here.** Folder name = URL slug. |
| [src/versions/_skeleton/](src/versions/_skeleton/) | Template for new versions. The `_` prefix hides it from the homepage. Don't edit. |
| [src/components/ui/](src/components/ui/) | Shared shadcn primitives. Versions can import from here. |
| [src/lib/utils.ts](src/lib/utils.ts) | Shared helpers (`cn` for Tailwind class merging). |
| [src/CLAUDE.md](src/CLAUDE.md) | Designer-audience rules + scope discipline for code work. |
| [package.json](package.json), [vite.config.ts](vite.config.ts), [tsconfig.json](tsconfig.json), [eslint.config.js](eslint.config.js), [.npmrc](.npmrc) | Build/tooling config. |
| [components.json](components.json) | shadcn CLI config. |

---

# Technical reference (for Claude — designers can skip)

The rest of this file is implementation detail Claude needs when doing code work. A designer reading this doesn't need to absorb any of it.

## Commands

| Command | What it does |
|---|---|
| `npm start` | `npm install` + Vite dev server on http://localhost:5173 |
| `npm run dev` | Vite dev server (skips install) |
| `npm run build` | `tsc -b` then `vite build` (type-check is part of the build) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over `**/*.{ts,tsx}` |

There is no test runner configured. Node 20+ is enforced via `engines` in [package.json](package.json) + `engine-strict` in [.npmrc](.npmrc); `npm start` fails fast on older Node.

## Architecture

This repo is a **shell that hosts multiple siloed app versions** under [src/versions/](src/versions/). The root app is just a homepage + router — all real product code lives inside per-version folders.

### Versioning model

- Each subfolder of [src/versions/](src/versions/) is one self-contained version. Folder name is the URL slug.
- A version must export:
  - `App.tsx` — `export default` a React component (the version's root).
  - `meta.ts` — `export const meta = { title, description? }` consumed by the homepage card.
  - Optionally a `CLAUDE.md` with per-version constraints (Claude Code picks it up when working inside that folder).
- Versions are intentionally **siloed**: do not import across `src/versions/*/` boundaries. Sharing happens only via `src/components/ui/*` (shadcn primitives) and `src/lib/utils.ts` (the `cn` helper).

### Discovery + routing

[src/App.tsx](src/App.tsx) wires it all up:

1. `import.meta.glob('./versions/*/meta.ts', { eager: true })` — eagerly imports all `meta.ts` so the homepage can render cards without paying the cost of loading every version's full code.
2. `import.meta.glob('./versions/*/App.tsx')` — *lazy* glob; the actual `App.tsx` modules are loaded via `React.lazy` only when the user navigates to that version. This is what produces the per-version code-split chunks at build time.
3. **Hash routing.** `useHashRoute()` reads `window.location.hash`. `#/` shows the homepage; `#/<slug>` mounts that version inside `<VersionFrame>`. No router library, no server config needed for `npm run preview`.
4. A back-link `← versions` is overlaid on every version (fixed top-left) so versions don't need to know about navigation.

### Adding a new version

There is a canonical skeleton at [src/versions/_skeleton/](src/versions/_skeleton/) (the `_` prefix excludes it from the homepage glob — it's a template, not a real version). Use the `/new-version` slash command to scaffold a new version: it asks for a slug + title, copies the skeleton, fills in `__TITLE__`/`__DESCRIPTION__`/`__SLUG__` placeholders, and prints the URL. Manual scaffolding is fine too — `cp -r src/versions/_skeleton src/versions/<slug>` then edit the placeholders.

### When the user prompts for new functionality

If the user describes a new app or feature without specifying a target version, **ask first** whether they want to:

- (a) scaffold a new version (point them at `/new-version`), or
- (b) modify an existing version (ask which one).

This is intentional — the audience for this project is designers who don't use git. The folder-per-version model is their version control. Don't overwrite an existing version's `App.tsx` without a clear directive.

Within a single version, the way to "save a snapshot" before a risky change is to **duplicate the folder** to a new slug. Both will appear on the homepage so the user can compare side-by-side. Do not initialise git in this repo.

### Why dependencies look heavy

The end user expects a particular dep set bundled (`@jsquash/*` WASM encoders, `fabric`, `jszip`, `react-compare-image`, `react-easy-crop`, `react-zoom-pan-pinch`, the shadcn stack). They are not used by the homepage shell — only by versions that opt in. Don't strip them.

### ESLint quirks

- Unused `_`-prefixed args/vars are allowed (placeholders).
- `react-refresh/only-export-components` is set to `warn` with `allowConstantExport: true` so shadcn's `*Variants` cva exports don't trip it.
