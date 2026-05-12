## Compare and compress — versions workshop

# Getting set up
1. You'll see VS Code open in your browser. This takes a couple of minutes to set up.
2. Open the Claude Code sidebar by clicking the orange star and sign in. 
3. The project should run automatically. You'll get a URL for your project in a pop-up. If you don't see it, Click PORTS at the bottom, then click the link by port 5173. 

> **About Claude's permissions in this workshop:** Claude is set to skip the usual "are you sure?" prompts inside the Codespace so you can focus on designing, not approving. This is only safe here because the Codespace is a sandboxed, throwaway machine in the cloud — it can't touch your real files. Don't reuse this setting on your own laptop.


## What's under the hood of our reference prototype?

# jSquash 

This is a browser-based image toolkit — compress, convert and resize entirely client-side. This is the "engine" of your app. It has no UI - it's an API. You'll be vibecoding the UI. 

- **JPEG** — quality 0–100 (default 75), progressive on/off, smoothing 0–100.
- **WebP** — quality 0–100, lossless on/off.
- **AVIF** — quality 0–100, lossless on/off. 
- **PNG** — no quality setting, compression on/off (OxiPNG).
- **Resize** — width and/or height in pixels. Upscaling and downscaling supported.

# Other libraries we've included for you, just in case

* **react-compare-image** — the draggable slider that wipes between "before" and "after".
* **react-zoom-pan-pinch** — lets the user zoom and pan inside the preview to inspect compression artefacts up close.
* **jszip** — bundles the compressed outputs into a single `.zip` for bulk download.

# The rest of the stack

- **React 19 + TypeScript + Vite** — app framework and dev/build tooling.
- **Tailwind CSS** (+ `tw-animate-css`) — utility-first styling and small animations.
- **shadcn/ui** — copy-in component library built on **Radix UI** primitives.

Too technical for you? Don't worry, it's not critical to know this and you can always ask for help.

# Setting up your PRD

- Claude (and most coding agents) like being given a PRD.MD file to work from.
- This is just a text file where you specify your requirements. 
- We've prepared a template for you to fill in, it's in:
 `src` > `versions` > `starter` > `PRD.md`
- When you're done, tell Claude to use the PRD e.g. `Read the PRD and build the web app`.
- It might take a few minutes! Keep an eye on the chat window as it might need you to respond to questions; if you don't, it'll stop working!

# Tip: Use more than one Claude

It can be helpful to have the Claude website open in a separate window. So you have two Claudes: 
1. Claude website can be used as more of a teacher. Ramble-chat and ask for guidance.
2. Claude Code sidebar in VS Code can then be given clean prompts. So when the code agent is working, you can chat to the other one to help you work out your next prompts.
Some people get very fancy with this (lots of different agents), but this is just lesson 1. 

# Prompt Claude like a Manager Would...

`Look at [URL/Screenshot] and match its visual style.`

`Look at this sketch I did, try a layout like this.`

`Before making any changes, summarise what you think I'm asking for.`


## Working with versions

The homepage lists every folder under [src/versions/](src/versions/) as a card. To add a new version:

- **In the Claude sidebar:** type `/new-version` (or just say "create me a new version") — Claude will ask for a name and scaffold the folder.
- **By hand:** `cp -r src/versions/_skeleton src/versions/<your-slug>`, then edit `meta.ts`.

Each new version ships with a `PRD.md` template. Open it, replace the bracketed placeholders with what you want to build, then ask Claude *"build this version from the PRD"*.

## What's wired up

- **Hash-routed homepage** in [src/App.tsx](src/App.tsx) — auto-discovers versions via `import.meta.glob`, shows last-edited time and PRD status.
- **Skeleton template** at [src/versions/_skeleton/](src/versions/_skeleton/) — copied for every new version. The leading underscore excludes it from the homepage.
- **`/new-version` slash command** at [.claude/commands/new-version.md](.claude/commands/new-version.md).
- **Tailwind v4** via `@tailwindcss/vite`, theme in [src/index.css](src/index.css).
- **shadcn/ui** primitives in [src/components/ui/](src/components/ui/), config in [components.json](components.json) — shared across versions.
- **Available libraries for versions:** Squoosh WASM encoders (`@jsquash/*`), `react-compare-image`, `react-easy-crop`, `react-zoom-pan-pinch`, `fabric`, `jszip`, `lucide-react` icons.
