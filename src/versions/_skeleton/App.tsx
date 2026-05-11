// Detect a PRD.md sitting next to this file, and compare it against the
// canonical skeleton PRD so we can tell three states apart:
//   - 'none'     — no PRD here (designer deleted it, or duplicated pre-PRD)
//   - 'pristine' — PRD present but byte-identical to the skeleton template
//   - 'edited'   — PRD has been changed (designer filled in their product)
// The glob form is used for the skeleton import so a missing file resolves
// to undefined instead of breaking the build.
const localPrdMatches = import.meta.glob('./PRD.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const skeletonPrdMatches = import.meta.glob('../_skeleton/PRD.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const localPrd = Object.values(localPrdMatches)[0] as string | undefined;
const skeletonPrd = Object.values(skeletonPrdMatches)[0] as string | undefined;

const prdStatus: 'none' | 'pristine' | 'edited' =
  localPrd === undefined
    ? 'none'
    : skeletonPrd !== undefined && localPrd.trim() === skeletonPrd.trim()
    ? 'pristine'
    : 'edited';

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-semibold">__TITLE__</h1>

        <div className="mt-6 rounded-lg border border-border bg-card p-5">
          {prdStatus === 'edited' && (
            <>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                  ✓
                </span>
                PRD ready
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Open Claude in the sidebar and ask{' '}
                <span className="font-medium text-foreground">
                  "build this version from the PRD"
                </span>
                .
              </p>
            </>
          )}

          {prdStatus === 'pristine' && (
            <>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                  !
                </span>
                PRD template — needs filling in
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Open <code className="rounded bg-muted px-1 py-0.5">PRD.md</code> in this folder and replace the bracketed placeholders with what you want to build. Save, then ask Claude.
              </p>
            </>
          )}

          {prdStatus === 'none' && (
            <>
              <p className="text-sm">Two steps to get started:</p>
              <ol className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">
                    1. Write a PRD
                  </span>{' '}
                  — create <code className="rounded bg-muted px-1 py-0.5">PRD.md</code> in this folder describing what you want to build.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    2. Prompt Claude
                  </span>{' '}
                  in the sidebar — ask{' '}
                  <span className="text-foreground">
                    "build this version from the PRD"
                  </span>
                  .
                </li>
              </ol>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
