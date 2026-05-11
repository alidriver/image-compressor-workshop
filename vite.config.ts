import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const VERSIONS_DIR = path.resolve(__dirname, 'src/versions');

function latestMtime(dir: string): number {
  let latest = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) latest = Math.max(latest, latestMtime(full));
    else if (entry.isFile()) latest = Math.max(latest, statSync(full).mtimeMs);
  }
  return latest;
}

function buildMtimeMap(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const entry of readdirSync(VERSIONS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) continue;
    out[entry.name] = latestMtime(path.join(VERSIONS_DIR, entry.name));
  }
  return out;
}

// Exposes `virtual:version-mtimes` — a `Record<slug, epochMs>` of the most
// recent mtime across all files in each `src/versions/<slug>/` folder.
// Re-emits + triggers a reload when anything in `src/versions/` changes.
function versionMtimesPlugin(): Plugin {
  const VIRTUAL = 'virtual:version-mtimes';
  const RESOLVED = '\0' + VIRTUAL;
  return {
    name: 'version-mtimes',
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED;
    },
    load(id) {
      if (id === RESOLVED) {
        return `export default ${JSON.stringify(buildMtimeMap())};`;
      }
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(VERSIONS_DIR)) return;
      const mod = server.moduleGraph.getModuleById(RESOLVED);
      if (mod) {
        server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), versionMtimesPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
