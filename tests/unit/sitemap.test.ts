import { describe, expect, it } from 'vitest'
import { sitemapPaths } from '~/content/site'
import { buildSitemap } from '~/lib/sitemap'

describe('buildSitemap', () => {
  it('lists every page on the live domain', () => {
    const xml = buildSitemap('2026-10-30')
    for (const path of sitemapPaths) {
      expect(xml).toContain(`<loc>https://ashishkharche.com${path}</loc>`)
    }
    expect(xml).toContain('<lastmod>2026-10-30</lastmod>')
    expect(xml).not.toContain('404')
  })
  it('rejects a bad date', () => {
    expect(() => buildSitemap('yesterday')).toThrow()
  })
  it('uses trailing slashes for every path', () => {
    for (const path of sitemapPaths) expect(path.endsWith('/')).toBe(true)
  })
})
