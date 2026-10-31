import { describe, expect, it } from 'vitest'
import { buildAtomFeed, feedPath } from '~/lib/feed'

const first = {
  title: 'Older & first',
  path: '/notes/a/',
  summary: 'Uses <tags> & "quotes".',
  published: '2026-10-01',
  updated: '2026-10-05',
}
const entries = [
  first,
  { title: 'Newer', path: '/notes/b/', summary: 'Second.', published: '2026-10-20', updated: '2026-10-20' },
]

describe('buildAtomFeed', () => {
  const xml = buildAtomFeed(entries)

  it('is an Atom 1.0 feed with a self link and an author', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom"')).toBe(
      true,
    )
    expect(xml).toContain(`<link rel="self" type="application/atom+xml" href="https://ashishkharche.com${feedPath}"/>`)
    expect(xml).toContain('<id>https://ashishkharche.com/notes/</id>')
    expect(xml).toContain('<author>\n    <name>Ashish Kharche</name>')
    expect(xml.trimEnd().endsWith('</feed>')).toBe(true)
  })

  it('lists notes newest first with absolute links and ids', () => {
    expect(xml.indexOf('Newer')).toBeLessThan(xml.indexOf('Older'))
    expect(xml).toContain('<id>https://ashishkharche.com/notes/b/</id>')
    expect(xml).toContain('<link rel="alternate" type="text/html" href="https://ashishkharche.com/notes/a/"/>')
    expect(xml).toContain('<published>2026-10-01T00:00:00Z</published>')
  })

  it('uses the latest note change as the feed date', () => {
    expect(xml).toContain('  <updated>2026-10-20T00:00:00Z</updated>\n  <author>')
  })

  it('escapes text', () => {
    expect(xml).toContain('<title>Older &amp; first</title>')
    expect(xml).toContain('Uses &lt;tags&gt; &amp; &quot;quotes&quot;.')
  })

  it('rejects an empty feed and bad dates', () => {
    expect(() => buildAtomFeed([])).toThrow()
    expect(() => buildAtomFeed([{ ...first, published: 'soon' }])).toThrow()
  })
})
