# Product Requirements Document

## What we're building

[One or two sentences. What is this product and who is it for?]

## Target user

[Who is the primary user? What's their technical level? What are they trying to accomplish?]

## Core user journey

1. **Arrive & decide** — [What does the first screen show? What convinces them to try it?]
2. **Upload & experiment** — [What does the main UI look like? How do they try different settings?]
3. **Compare & decide** — [How do they evaluate the output? Before/after, file size comparison?]
4. **Download & done** — [Single file, batch zip? What's the confirmation?]

## V1 scope

### In scope
[What must be in the first version?]

### Out of scope
[What are you explicitly not building yet?]

## UI preferences

[Any strong preferences about layout, tone, simplicity vs power? e.g. "dead simple, one screen" or "power user controls visible upfront"]

## Visual style

[Describe the look and feel, or reference an existing product: "dark mode, precise like Adobe Lightroom" or "Bright and friendly like Canva". You can also paste a URL to take inspiration from. If you give it a storybook URL this way, it wont ingest it properly, it'll create an "inspired by" rough approximation. Fine for an intial workshop.]

## Tech stack

- **jSquash** — client-side image compression engine (JPEG, WebP, AVIF, PNG, Resize)
- **react-compare-image** — before/after drag slider
- **react-zoom-pan-pinch** — zoom/pan for inspecting compression artefacts
- **jszip** — bulk download as a single zip file
- **React 19 + TypeScript + Vite** — app framework and build tooling
- **Tailwind CSS** — styling
- **shadcn/ui** — component library

## Open questions

[What do you still not know? What decisions have you deferred?]
