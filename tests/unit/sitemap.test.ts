import { describe, expect, it } from 'vitest'
import { sitemapPaths } from '~/content/site'
import { buildSitemap } from '~/lib/sitemap'

describe('buildSitemap', () => {
  it('lists every page on the live domain', () => {
    const xml = buildSitemap({})
    for (const path of sitemapPaths) {
      expect(xml).toContain(`<loc>https://ashishkharche.com${path}</loc>`)
    }
    expect(xml).not.toContain('404')
  })
  it('gives each page its own last-modified date', () => {
    const xml = buildSitemap({ '/': '2026-10-31', '/notes/workout-director-1/': '2026-10-30' })
    expect(xml).toContain('<loc>https://ashishkharche.com/</loc><lastmod>2026-10-31</lastmod>')
    expect(xml).toContain('<loc>https://ashishkharche.com/notes/workout-director-1/</loc><lastmod>2026-10-30</lastmod>')
  })
  it('leaves lastmod out for a page with no known date instead of using today', () => {
    const xml = buildSitemap({ '/': '2026-10-31' })
    expect(xml).toContain('<loc>https://ashishkharche.com/work/</loc></url>')
    expect(xml.match(/<lastmod>/g)).toHaveLength(1)
  })
  it('rejects a bad date', () => {
    expect(() => buildSitemap({ '/': 'yesterday' })).toThrow()
  })
  it('uses trailing slashes for every path', () => {
    for (const path of sitemapPaths) expect(path.endsWith('/')).toBe(true)
  })
})
