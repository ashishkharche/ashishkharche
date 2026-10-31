# ashishkharche.com

Personal site of Ashish Kharche. Static pages built with TanStack Start, styled with StyleX, written in TypeScript and MDX.

## Commands

```sh
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # static site in dist/client
pnpm preview        # serve dist/client on http://localhost:4173
pnpm check          # everything below, in order
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test           # Vitest unit tests
pnpm test:e2e       # Playwright: every page, no-JS, theme, axe in light and dark (needs a build)
pnpm check:links    # crawls the build and checks every link and image
pnpm lighthouse     # mobile and desktop scores for every page
pnpm screenshots    # full-page screenshots at 375, 768 and 1280 in light and dark (needs `pnpm preview` running)
```

Playwright and the screenshot and Lighthouse scripts use the installed Chrome. Set `PW_CHANNEL=chromium` after
`pnpm exec playwright install chromium` to use Playwright's own browser instead.

## Layout

```
content/
  diagrams/*.mmd        Mermaid sources, rendered to SVG at build time
  notes/*.mdx           notes, one file each, with YAML frontmatter
  projects/*.mdx        case study text
plugins/content.ts      Vite plugin: .mmd imports and MDX frontmatter imports
plugins/highlight.ts    Shiki setup for fenced code blocks (languages, token classes)
public/                 favicons, robots.txt, web manifest, fonts, screenshots, social image
scripts/                post-build step, local server, link check, Lighthouse, screenshots, deploy manifest
src/
  routes/               one file per page (TanStack Router file routes)
  components/           header, footer, cards, figures, prose
  content/              page data: site links, work history, projects, note list, content rules
  lib/                  SEO tags, URLs, dates, sitemap, CSP
  styles/               StyleX tokens and shared styles, global.css (font faces, reset, diagram sizing)
tests/unit              Vitest
tests/e2e               Playwright
```

## Adding a note

Create `content/notes/<slug>.mdx` with frontmatter (`title`, `date` as YYYY-MM-DD, `series`, `part`, `listLabel`,
`description`), add `/notes/<slug>/` to `sitemapPaths` in `src/content/site.ts`, and remove its title from `comingNotes` in
`src/content/notes.ts` if it was listed there. Diagrams: add a `.mmd` file to `content/diagrams`, import it in the MDX file and
use `<Diagram diagram={…} title="…" caption="…" />`. Code: use fenced blocks with a language tag (` ```python `);
the language has to be listed in `plugins/highlight.ts`.

## Content rules

Kept as tests (`tests/unit/content-rules.test.ts`) and checked again on the built HTML: no personal contact or identity details beyond
email and profile links, no secrets, no old side projects, and the company and role wording on the Work page stays as agreed. The
patterns are in `src/content/rules.ts`.

See STACK.md for why the stack is what it is, and DEPLOY.md for deploying.
