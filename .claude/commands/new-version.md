---
description: Scaffold a new app version under src/versions/
---

The user wants to create a new app version. Walk them through it:

1. **Ask for a slug and a title.** The slug is the URL-safe folder name (lowercase, hyphens, no spaces — e.g. `image-editor`). The title is the human-readable name shown on the homepage card (e.g. "Image Editor"). Optionally ask for a one-line description.

2. **Validate the slug.**
   - Must match `^[a-z0-9][a-z0-9-]*$` (lowercase, hyphens, no leading hyphen, no underscores — `_` is reserved for skeleton folders).
   - Must not collide with an existing folder under `src/versions/`. Check with `ls src/versions/` first. If it collides, ask for a different slug.

3. **Copy the skeleton.** Run `cp -r src/versions/_skeleton src/versions/<slug>` (use Bash). Do not skip this — the skeleton is the source of truth for the version layout.

4. **Fill in placeholders.** In the new folder, replace `__TITLE__`, `__DESCRIPTION__`, and `__SLUG__`:
   - `meta.ts` — `__TITLE__`, `__DESCRIPTION__`
   - `App.tsx` — `__TITLE__`
   - `CLAUDE.md` — `__SLUG__` (every occurrence)

   Use Edit with `replace_all: true` per file. If the user didn't provide a description, replace `__DESCRIPTION__` with an empty string and remove the `description` line from `meta.ts` so the card stays clean.

5. **Confirm and hand off.** Tell the user:
   - The version is live at `http://localhost:5173/#/<slug>` (a refresh of the dev server may be needed if Vite's HMR doesn't pick up new files automatically).
   - The folder ships with a template `PRD.md` they need to fill in — point them at `src/versions/<slug>/PRD.md`. Until they edit it, the version page shows a "PRD template — needs filling in" warning.
   - Once the PRD is filled in, they can ask you "build this version from the PRD" to start the implementation.

Do not start implementing the version's actual functionality in this command — only scaffold. Wait for the user's next prompt before writing feature code.
