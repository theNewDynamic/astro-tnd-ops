import type { AstroIntegration } from 'astro';
import { type ManifestOptions, type TndManifest } from './features/manifest.js';
export type { ManifestOptions, TndManifest };
/**
 * One option per feature: `true` (or omitted) turns it on with its defaults, an object configures it, `false`
 * turns it off. New features join here, each in its own module under `features/`.
 */
export interface TndOpsOptions {
    /** `/.well-known/tnd.json`, read by TND Ops (last deployed, output mode, Sanity dataset). On by default. */
    manifest?: boolean | ManifestOptions;
}
export default function tndOps(options?: TndOpsOptions): AstroIntegration;
//# sourceMappingURL=index.d.ts.map