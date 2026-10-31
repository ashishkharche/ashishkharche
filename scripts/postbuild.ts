// Runs after `vite build`: writes the sitemap, adds a per-page
// Content-Security-Policy, copies the host config and checks the output.
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { findBanned, loadLocalTerms, localTermsFile } from '../src/content/rules.ts'
import { site, sitemapPaths } from '../src/content/site.ts'
import { withPolicy } from '../src/lib/csp.ts'
import { checkPreviewTags, pngSize } from '../src/lib/preview.ts'
import { buildSitemap } from '../src/lib/sitemap.ts'

const out = new URL('../dist/client/', import.meta.url).pathname

async function htmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return entry.name === 'assets' ? [] : htmlFiles(path)
      return entry.name.endsWith('.html') ? [path] : []
    }),
  )
  return files.flat()
}

const problems: string[] = []
if (!loadLocalTerms()) console.info(`Local terms list not found at ${localTermsFile}; skipping that check.`)
const pages = await htmlFiles(out)

for (const file of pages) {
  const name = relative(out, file)
  let html = await readFile(file, 'utf8')
  if (/\sstyle="/i.test(html)) problems.push(`${name}: has an inline style attribute (blocked by the CSP)`)
  if (/<style[\s>]/i.test(html)) problems.push(`${name}: has an inline <style> element (blocked by the CSP)`)
  for (const hit of findBanned(html)) problems.push(`${name}: ${hit}`)
  if (name !== '404.html') {
    const preview = checkPreviewTags(html, site.url)
    for (const problem of preview.problems) problems.push(`${name}: ${problem}`)
    if (preview.imagePath) {
      const image = await readFile(join(out, preview.imagePath)).catch(() => undefined)
      const size = image && pngSize(image)
      if (!image) problems.push(`${name}: og:image ${preview.imagePath} is not in the build`)
      else if (!size || size.width !== 1200 || size.height !== 630) {
        problems.push(`${name}: og:image ${preview.imagePath} is not a 1200x630 PNG`)
      }
    }
  }
  html = withPolicy(html)
  await writeFile(file, html)
}

for (const path of sitemapPaths) {
  const file = path === '/' ? 'index.html' : `${path.slice(1)}index.html`
  if (!pages.some((page) => relative(out, page) === file)) problems.push(`sitemap path ${path} was not prerendered`)
}
if (!pages.some((page) => relative(out, page) === '404.html')) problems.push('404.html was not prerendered')

const lastmod = process.env.SITE_LASTMOD ?? new Date().toISOString().slice(0, 10)
await writeFile(join(out, 'sitemap.xml'), buildSitemap(lastmod))

// For a static upload the output folder needs the headers, but not the build settings.
const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8')) as Record<string, unknown>
const staticConfig = Object.fromEntries(
  Object.entries(config).filter(
    ([key]) => !['buildCommand', 'installCommand', 'outputDirectory', 'framework'].includes(key),
  ),
)
await writeFile(join(out, 'vercel.json'), `${JSON.stringify(staticConfig, null, 2)}\n`)

if (problems.length > 0) {
  console.error(`Post-build checks failed:\n- ${problems.join('\n- ')}`)
  process.exit(1)
}
console.log(`Post-build: ${pages.length} pages checked, CSP added, sitemap.xml and vercel.json written.`)
