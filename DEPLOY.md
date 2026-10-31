# Deploying

The site builds to plain static files in `dist/client`. Nothing runs on a server. Two ways to put it on the Vercel project
`ashishkharche` (domain ashishkharche.com):

## Before either option

```sh
pnpm install --frozen-lockfile
pnpm check        # typecheck, lint, format, unit tests, build, Playwright + axe, link check
pnpm lighthouse   # optional; needs Chrome (set CHROME_PATH if it is not found)
```

`pnpm build` runs `vite build` and then `scripts/postbuild.ts`, which:

- writes `dist/client/sitemap.xml`, with each page's `lastmod` taken from its content date or the last git commit that touched its source files (never the build time),
- writes the Atom feed of the notes to `dist/client/feed.xml`,
- adds a per-page Content-Security-Policy meta tag with the hashes of that page's inline scripts,
- copies the headers from `vercel.json` into `dist/client/vercel.json` (without the build settings),
- fails the build if a page has an inline style, a banned word (see `src/content/rules.ts`), or a sitemap page is missing.

Requires Node 22.18 or newer (the scripts are TypeScript run directly by Node) and pnpm 10.

## Option A: static upload (what the current site uses)

Upload the contents of `dist/client` as they are, with no build step on Vercel.

1. `pnpm build && pnpm deploy:manifest`. This writes `dist/deploy-manifest.json`: every file under `dist/client` with its path,
   SHA-1 and size (about 70 files, 1.7 MB).
2. Upload each file through the Vercel REST API (`POST /v2/files`), sending the file's bytes with its SHA-1 in the
   `x-vercel-digest` header and its size as the content length. Files Vercel already has are skipped by digest.
3. Create a deployment through the Vercel REST API (`POST /v13/deployments`) for project `ashishkharche`, scoped to the
   Vercel team that owns it, with:
   - `files`: the manifest entries (`{ "file": "work/index.html", "sha": "…", "size": … }`),
   - `projectSettings`: `{ "framework": null, "buildCommand": "", "installCommand": "", "outputDirectory": null }`.
     The empty build and install commands tell Vercel to skip both steps and serve the files exactly as uploaded. Leaving
     them as `null` makes Vercel fall back to the project's framework setting and run `vite build`, which fails because
     the upload has no source.
   - `target`: `production` (or leave it out for a preview first).
4. Check the preview URL, then promote or alias it as usual.

`dist/client/vercel.json` is part of the upload and carries the headers (security headers, `frame-ancestors`, long caching for
fonts and hashed JS/CSS) and `"trailingSlash": true`, which redirects `/work` to `/work/`. `404.html` is served for unknown paths.
It is rendered at build time from a path no route matches (see `src/server.ts`), so it hydrates the same way in the
browser on any unknown URL.
`dist/server` is a by-product of the build and is not deployed.

## Option B: Vercel builds from GitHub (`ashishkharche/ashishkharche.com`)

1. Push this folder as the repository root.
2. In Vercel, connect the repository to the `ashishkharche` project. `vercel.json` in the repo sets everything the build needs:
   - Framework preset: none (`"framework": null`)
   - Install: `pnpm install --frozen-lockfile`
   - Build: `pnpm build`
   - Output directory: `dist/client`
   - Node.js: 22.x or 24.x (project setting; 22.18+ is required)
3. Every push to the production branch deploys; pull requests get preview deployments.

The project's settings in the dashboard are not changed by this repository; `vercel.json` overrides them per deployment.

## After deploying

- Open `/`, `/work/`, `/projects/workout-director/`, `/notes/workout-director-1/` and a made-up URL (should show the 404 page).
- Check the browser console for Content-Security-Policy errors (there should be none).
- Run Lighthouse against the live URL if anything about images or scripts changed.
