import { mkdir, writeFile } from 'node:fs/promises';
import type { AstroConfig } from 'astro';

/**
 * `/.well-known/tnd.json`: what TND Ops reads from a live site. Public, so only facts that are harmless or already
 * visible: when the site was built, how it's built, which Sanity dataset it reads. No versions (they'd tell an
 * attacker which known vulnerabilities to try), no commit, no secrets.
 */
export interface TndManifest {
  /** Bumped when a field changes meaning or goes away; new fields don't bump it. */
  version: 1;
  build: {
    /** When this build ran (ISO): "last deployed" in TND Ops. */
    at: string;
  };
  /** Astro's `output`: "static" pages only change with a new build, so TND Ops can tell when the site is behind its content. */
  output: AstroConfig['output'];
  sanity: {
    /** The dataset the site reads, so TND Ops can catch a live site on `staging`. Null when not known. */
    dataset: string | null;
  };
}

export interface ManifestOptions {
  /**
   * The Sanity dataset the site reads. Defaults to what the site itself uses: the build's `SANITY_STUDIO_DATASET`
   * environment variable, else that variable's default in the project's `env.schema` (astro:env). Null when none.
   */
  dataset?: string;
}

/** A variable's `default` in the project's astro:env schema: what the site falls back to when it isn't set. */
function schemaDefault(config: AstroConfig, name: string): string | null {
  const field: unknown = (config.env?.schema as Record<string, unknown> | undefined)?.[name];
  const value = field && typeof field === 'object' && 'default' in field ? (field as { default: unknown }).default : undefined;
  return typeof value === 'string' && value !== '' ? value : null;
}

/** Where the manifest is served from, relative to the site root. */
export const MANIFEST_PATH = '.well-known/tnd.json';

export function buildManifest(config: AstroConfig, options: ManifestOptions, now = new Date()): TndManifest {
  return {
    version: 1,
    build: { at: now.toISOString() },
    output: config.output,
    sanity: { dataset: options.dataset ?? process.env.SANITY_STUDIO_DATASET ?? schemaDefault(config, 'SANITY_STUDIO_DATASET') },
  };
}

/** Writes the manifest into the build's static output (`dir`: what the host serves as files). */
export async function writeManifest(dir: URL, manifest: TndManifest): Promise<URL> {
  const file = new URL(MANIFEST_PATH, dir);
  await mkdir(new URL('./', file), { recursive: true });
  await writeFile(file, `${JSON.stringify(manifest, null, 2)}\n`);
  return file;
}
