import { mkdir, writeFile } from 'node:fs/promises';
/** A variable's `default` in the project's astro:env schema: what the site falls back to when it isn't set. */
function schemaDefault(config, name) {
    const field = config.env?.schema?.[name];
    const value = field && typeof field === 'object' && 'default' in field ? field.default : undefined;
    return typeof value === 'string' && value !== '' ? value : null;
}
/** Where the manifest is served from, relative to the site root. */
export const MANIFEST_PATH = '.well-known/tnd.json';
export function buildManifest(config, options, now = new Date()) {
    return {
        version: 1,
        build: { at: now.toISOString() },
        output: config.output,
        sanity: { dataset: options.dataset ?? process.env.SANITY_STUDIO_DATASET ?? schemaDefault(config, 'SANITY_STUDIO_DATASET') },
    };
}
/** Writes the manifest into the build's static output (`dir`: what the host serves as files). */
export async function writeManifest(dir, manifest) {
    const file = new URL(MANIFEST_PATH, dir);
    await mkdir(new URL('./', file), { recursive: true });
    await writeFile(file, `${JSON.stringify(manifest, null, 2)}\n`);
    return file;
}
//# sourceMappingURL=manifest.js.map