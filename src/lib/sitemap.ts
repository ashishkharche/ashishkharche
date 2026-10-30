import { sitemapPaths, site } from '../content/site.ts'

/** sitemap.xml for the given paths, all with the same last-modified date. */
export function buildSitemap(
  lastmod: string,
  paths: readonly string[] = sitemapPaths,
  base: string = site.url,
): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) throw new Error(`lastmod must be YYYY-MM-DD, got "${lastmod}"`)
  const urls = paths.map((path) => `  <url><loc>${base}${path}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}
