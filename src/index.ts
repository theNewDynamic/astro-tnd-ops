import type { AstroConfig, AstroIntegration } from 'astro';
import { buildManifest, MANIFEST_PATH, writeManifest, type ManifestOptions, type TndManifest } from './features/manifest.js';

export type { ManifestOptions, TndManifest };

/**
 * One option per feature: `true` (or omitted) turns it on with its defaults, an object configures it, `false`
 * turns it off. New features join here, each in its own module under `features/`.
 */
export interface TndOpsOptions {
  /** `/.well-known/tnd.json`, read by TND Ops (last deployed, output mode, ASTRO_ENV, Sanity dataset). On by default. */
  manifest?: boolean | ManifestOptions;
}

const featureOptions = <T extends object>(value: boolean | T | undefined): T | null => (value === false ? null : value === true || value === undefined ? ({} as T) : value);

export default function tndOps(options: TndOpsOptions = {}): AstroIntegration {
  const manifest = featureOptions(options.manifest);
  let config: AstroConfig;

  return {
    name: '@thenewdynamic/astro-tnd-ops',
    hooks: {
      'astro:config:done': ({ config: resolved }) => {
        config = resolved;
      },
      'astro:build:done': async ({ dir, logger }) => {
        if (manifest) {
          await writeManifest(dir, buildManifest(config, manifest));
          logger.info(`Wrote /${MANIFEST_PATH}`);
        }
      },
    },
  };
}
