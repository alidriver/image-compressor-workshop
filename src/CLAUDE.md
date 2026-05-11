# CLAUDE.md (src/)

Constraints for code work inside `src/`. Builds on the root [CLAUDE.md](../CLAUDE.md).

## Audience

The end user is a **designer**, not an engineer. They:

- May not be comfortable reading code, stack traces, or verbose terminal output.
- Are not using git — folder duplication under `src/versions/` is their version control.
- Work primarily through the Claude sidebar in VS Code.

When you communicate back:

- Prefer plain English over jargon. "Made the button bigger" beats "increased button height by 4px and adjusted padding".
- Lead with what the change *looks like or does for the user*, not how it's implemented.
- Don't propose engineering chores (refactors, dep upgrades, type-safety improvements, test scaffolding) unless explicitly asked.
- Don't surface implementation choices that don't change the visible outcome (e.g. "I extracted this into a helper" — they don't need to know).

## Scope discipline

- All product code lives inside `src/versions/<slug>/`. When working on one version, do not modify another version's folder, even to "fix" something — versions are siloed by design.
- Promote code to `src/components/ui/` or `src/lib/` only when it is *already* used by two or more versions. Don't extract preemptively.
- Do not modify `src/App.tsx` (homepage/router), `src/main.tsx`, or `src/index.css` unless the user explicitly asks. These are the shell.
- Do not modify `src/versions/_skeleton/`. It is the canonical template for new versions.

## Visual fidelity

- Use shadcn primitives from `src/components/ui/` and Tailwind tokens (`bg-background`, `text-muted-foreground`, `border-border`, etc.) rather than ad-hoc hex codes or pixel sizes. The token system is the design system.
- If the user references a visual (uploaded image, Figma frame, description), match it. Don't invent your own palette, type scale, or spacing.
- Use `lucide-react` for icons. Don't pull in another icon set.

## When the user asks for new functionality

If the user describes something to build but doesn't say which version, **ask** whether to:

- (a) scaffold a new version (suggest `/new-version`), or
- (b) modify an existing one (which?).

Don't guess. Overwriting an existing version's `App.tsx` without confirmation is destructive in this no-git setup.

## Additional constraints

<!-- Add project-specific rules here. Each rule: one line stating the constraint, optional second line with the why. -->
