# Version: __SLUG__

This folder is a self-contained version of the app. Treat it as a sandbox: changes here should not leak into other version folders.

- Entry point: `App.tsx` (default-exported component, rendered by the root router when the URL hash is `#/__SLUG__`).
- Metadata: `meta.ts` exports `{ title, description }` consumed by the homepage card.
- Slug: derived from this folder's name (`__SLUG__`). Renaming the folder changes the URL.

You may import shared UI primitives from `@/components/ui/*` and the `cn` helper from `@/lib/utils`. Do not import from sibling `src/versions/*/` folders — versions are intentionally siloed.

When adding new files, keep them inside this folder unless they're genuinely shared utilities (in which case put them in `src/lib/` or `src/components/ui/`).

## PRD-driven builds

If this folder contains a `PRD.md`, treat it as the source of truth for what to build. The starter `App.tsx` detects it via `import.meta.glob` and shows a "PRD detected" indicator. When the user asks you to "build this version from the PRD", read `PRD.md` first and replace the placeholder `App.tsx` with the implementation it describes.

## Saving an iteration

There is no git in this project (intentionally). To preserve a working state before a risky pivot, **duplicate this entire folder** to a new slug (e.g. `__SLUG__-v2`). Both will appear as cards on the homepage so the user can compare them side-by-side.
