import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react';

import { Button } from '@/components/ui/button';
import versionMtimes from 'virtual:version-mtimes';

type VersionMeta = { title: string; description?: string };

// Eager-load metadata for every version so the homepage can render cards
// without paying the cost of importing each version's full App. The App.tsx
// modules themselves are picked up lazily on navigation.
const metaModules = import.meta.glob<{ meta: VersionMeta }>(
  './versions/*/meta.ts',
  { eager: true },
);

const appModules = import.meta.glob<{ default: ComponentType }>(
  './versions/*/App.tsx',
);

type VersionEntry = {
  slug: string;
  meta: VersionMeta;
  load: () => Promise<{ default: ComponentType }>;
};

function slugFromPath(path: string): string {
  // './versions/<slug>/meta.ts' or './versions/<slug>/App.tsx'
  return path.split('/')[2];
}

const versions: VersionEntry[] = Object.entries(metaModules)
  .map(([metaPath, mod]) => {
    const slug = slugFromPath(metaPath);
    const appPath = `./versions/${slug}/App.tsx`;
    const load = appModules[appPath];
    if (!load) {
      throw new Error(`Version "${slug}" is missing App.tsx`);
    }
    return { slug, meta: mod.meta, load };
  })
  // Folders prefixed with `_` are templates/skeletons, not real versions.
  .filter((v) => !v.slug.startsWith('_'))
  .sort((a, b) => a.slug.localeCompare(b.slug));

const versionBySlug = new Map(versions.map((v) => [v.slug, v]));

function formatRelative(ms: number): string {
  if (!ms) return '';
  const diff = Date.now() - ms;
  const sec = Math.round(diff / 1000);
  if (sec < 60) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ms).toLocaleDateString();
}

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const onChange = () => setHash(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">Versions</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Each card is a siloed app under <code className="rounded bg-muted px-1.5 py-0.5">src/versions/</code>. Click one to open it.
          </p>
        </header>

        {versions.length > 0 && (
          <ul className="mb-12 grid gap-3 sm:grid-cols-2">
            {versions.map((v) => (
              <li key={v.slug}>
                <a
                  href={`#/${v.slug}`}
                  className="block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-base font-medium">{v.meta.title}</div>
                    {versionMtimes[v.slug] ? (
                      <div
                        className="shrink-0 text-[11px] text-muted-foreground"
                        title={new Date(versionMtimes[v.slug]).toLocaleString()}
                      >
                        {formatRelative(versionMtimes[v.slug])}
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                    #/{v.slug}
                  </div>
                  {v.meta.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {v.meta.description}
                    </p>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}

        <section className="rounded-lg border border-dashed border-border p-6">
          <h2 className="text-base font-medium">Add a new version</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            In the Claude sidebar, type:
          </p>
          <pre className="mt-3 rounded bg-muted px-3 py-2 font-mono text-sm">/new-version</pre>
          <p className="mt-2 text-xs text-muted-foreground">
            Or just write{' '}
            <span className="font-medium text-foreground">
              "create me a new version"
            </span>{' '}
            — Claude will ask you for a name.
          </p>
        </section>
      </div>
    </div>
  );
}

function VersionFrame({ slug }: { slug: string }) {
  const entry = versionBySlug.get(slug);
  if (!entry) return <NotFound slug={slug} />;

  const LazyApp = lazy(entry.load);
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
      <LazyApp />
    </Suspense>
  );
}

function NotFound({ slug }: { slug: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Version not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No folder <code className="rounded bg-muted px-1.5 py-0.5">src/versions/{slug}</code>.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <a href="#/">Back to versions</a>
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  const route = useHashRoute();
  if (route === '/' || route === '') return <Home />;
  const slug = route.replace(/^\//, '').split('/')[0];
  return <VersionFrame slug={slug} />;
}
