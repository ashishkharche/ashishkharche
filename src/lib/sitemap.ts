import { sitemapPaths, site } from '../content/site.ts'

const day = /^\d{4}-\d{2}-\d{2}$/

/** sitemap.xml for the given paths. Each page gets its own last-modified date; a page without one has no lastmod. */
export function buildSitemap(
  lastmod: Readonly<Record<string, string>>,
  paths: readonly string[] = sitemapPaths,
  base: string = site.url,
): string {
  const urls = paths
    .map((path) => {
      const date = lastmod[path]
      if (date !== undefined && !day.test(date))
        throw new Error(`lastmod for ${path} must be YYYY-MM-DD, got "${date}"`)
      return `  <url><loc>${base}${path}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}
