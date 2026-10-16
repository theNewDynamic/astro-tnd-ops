import { buildManifest, MANIFEST_PATH, writeManifest } from './features/manifest.js';
const featureOptions = (value) => (value === false ? null : value === true || value === undefined ? {} : value);
export default function tndOps(options = {}) {
    const manifest = featureOptions(options.manifest);
    let config;
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
//# sourceMappingURL=index.js.map