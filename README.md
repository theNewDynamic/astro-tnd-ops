# @thenewdynamic/astro-tnd-ops

Astro integration that lets [TND Ops](https://github.com/theNewDynamic/sanity-backups) read a site. For now it does one
thing: at build time, it publishes `/.well-known/tnd.json`, which TND Ops uses to know when the site was last deployed,
whether it's built static, which environment (`ASTRO_ENV`) it was built for, and which Sanity dataset it reads.

## Installation

Installed from GitHub (it isn't published on npm), pinned to a release tag:

```sh
npm install github:theNewDynamic/astro-tnd-ops#v0.1.1
```

That adds `"@thenewdynamic/astro-tnd-ops": "github:theNewDynamic/astro-tnd-ops#v0.1.1"` to `package.json`. The repo is
public so that build servers (Netlify, Workers Builds) can fetch it without credentials: keep anything private out of it.

```js
// astro.config.mjs
import tndOps from '@thenewdynamic/astro-tnd-ops';

export default defineConfig({
  integrations: [tndOps()],
});
```

Nothing else: the file is written into the build output, whatever the adapter (tested with `@astrojs/cloudflare` and
`@astrojs/netlify`), and served as a static file.

## `/.well-known/tnd.json`

```json
{
  "version": 1,
  "build": { "at": "2026-10-16T14:30:13.139Z" },
  "output": "static",
  "env": "production",
  "sanity": { "dataset": "production" }
}
```

| Field | What it is | Used by TND Ops for |
|---|---|---|
| `version` | Format version. Bumped only when a field changes meaning or goes away. | Reading old and new sites alike. |
| `build.at` | When the build ran. | "Last deployed". |
| `output` | Astro's `output` (`static` or `server`). | "Site behind its content": only static pages wait for a build. |
| `env` | The build's `ASTRO_ENV`, else its default in the project's `env.schema` (or the option below); `null` when unknown. Pages rendered on request read `ASTRO_ENV` again at run time. | Catching a live site not built for `production` (no analytics, SEO off). |
| `sanity.dataset` | The dataset the site reads: the build's `SANITY_STUDIO_DATASET`, else its default in the project's `env.schema` (or the option below); `null` when unknown. | Catching a live site that reads `staging`. |

**The file is public, so it only holds facts that are harmless or already visible.** No package versions (they would
tell an attacker which known vulnerabilities to try), no commit, no environment values beyond `ASTRO_ENV` and the dataset name,
nothing about users. Keep it that way when adding fields.

## Options

Each feature has one option: omitted or `true` turns it on with its defaults, an object configures it, `false` turns
it off.

```js
tndOps({
  manifest: {
    // The environment the site was built for, when it isn't in ASTRO_ENV at build time.
    env: 'production',
    // The Sanity dataset the site reads, when it isn't in SANITY_STUDIO_DATASET at build time.
    dataset: 'production',
  },
});
```

| Option | Default | Description |
|---|---|---|
| `manifest` | `true` | Publish `/.well-known/tnd.json`. |
| `manifest.env` | `ASTRO_ENV`, else its `env.schema` default | Environment reported in the manifest. |
| `manifest.dataset` | `SANITY_STUDIO_DATASET`, else its `env.schema` default | Sanity dataset reported in the manifest. |

## Adding a feature

Each feature is a module in `src/features/` with its own option in `TndOpsOptions` (`src/index.ts`), wired into the
integration's hooks there.

## Releasing

`dist/` is committed: npm doesn't build a package it installs from GitHub (it would have to install Astro and
TypeScript first), so projects get the built files as they are in the repo.

1. `npm run build`, and commit the change with `dist/`.
2. Bump `version` in `package.json`, commit, and tag it: `git tag v0.2.0 && git push --tags`.
3. In each project: `npm install github:theNewDynamic/astro-tnd-ops#v0.2.0`.

## Development

```sh
npm install
npm run build   # or: npm run dev (watch)
```
