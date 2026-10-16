# @thenewdynamic/astro-tnd-ops

Astro integration that lets [TND Ops](https://github.com/theNewDynamic/sanity-backups) read a site. For now it does one
thing: at build time, it publishes `/.well-known/tnd.json`, which TND Ops uses to know when the site was last deployed,
whether it's built static, and which Sanity dataset it reads.

## Installation

```sh
npm install @thenewdynamic/astro-tnd-ops
```

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
  "sanity": { "dataset": "production" }
}
```

| Field | What it is | Used by TND Ops for |
|---|---|---|
| `version` | Format version. Bumped only when a field changes meaning or goes away. | Reading old and new sites alike. |
| `build.at` | When the build ran. | "Last deployed". |
| `output` | Astro's `output` (`static` or `server`). | "Site behind its content": only static pages wait for a build. |
| `sanity.dataset` | The dataset the site reads, from the build's `SANITY_STUDIO_DATASET` (or the option below); `null` when unknown. | Catching a live site that reads `staging`. |

**The file is public, so it only holds facts that are harmless or already visible.** No package versions (they would
tell an attacker which known vulnerabilities to try), no commit, no environment values beyond the dataset name,
nothing about users. Keep it that way when adding fields.

## Options

Each feature has one option: omitted or `true` turns it on with its defaults, an object configures it, `false` turns
it off.

```js
tndOps({
  manifest: {
    // The Sanity dataset the site reads, when it isn't in SANITY_STUDIO_DATASET at build time.
    dataset: 'production',
  },
});
```

| Option | Default | Description |
|---|---|---|
| `manifest` | `true` | Publish `/.well-known/tnd.json`. |
| `manifest.dataset` | `process.env.SANITY_STUDIO_DATASET` | Sanity dataset reported in the manifest. |

## Adding a feature

Each feature is a module in `src/features/` with its own option in `TndOpsOptions` (`src/index.ts`), wired into the
integration's hooks there. Release with a version bump and `npm publish` (`prepublishOnly` builds `dist/`), then bump
the dependency in each project.

## Development

```sh
npm install
npm run build   # or: npm run dev (watch)
```
