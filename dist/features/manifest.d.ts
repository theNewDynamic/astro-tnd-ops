import type { AstroConfig } from 'astro';
/**
 * `/.well-known/tnd.json`: what TND Ops reads from a live site. Public, so only facts that are harmless or already
 * visible: when the site was built, how it's built, which environment it was built for, which Sanity dataset it reads. No versions (they'd tell an
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
    /** The build's `ASTRO_ENV` ("production", "staging"…), so TND Ops can catch a live site not built for production. Null when not known. */
    env: string | null;
    sanity: {
        /** The dataset the site reads, so TND Ops can catch a live site on `staging`. Null when not known. */
        dataset: string | null;
    };
}
export interface ManifestOptions {
    /**
     * The environment the site was built for. Defaults to the build's `ASTRO_ENV` environment variable, else its default
     * in the project's `env.schema` (astro:env). Null when none.
     */
    env?: string;
    /**
     * The Sanity dataset the site reads. Defaults to what the site itself uses: the build's `SANITY_STUDIO_DATASET`
     * environment variable, else that variable's default in the project's `env.schema` (astro:env). Null when none.
     */
    dataset?: string;
}
/** Where the manifest is served from, relative to the site root. */
export declare const MANIFEST_PATH = ".well-known/tnd.json";
export declare function buildManifest(config: AstroConfig, options: ManifestOptions, now?: Date): TndManifest;
/** Writes the manifest into the build's static output (`dir`: what the host serves as files). */
export declare function writeManifest(dir: URL, manifest: TndManifest): Promise<URL>;
//# sourceMappingURL=manifest.d.ts.map