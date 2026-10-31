import { site } from '../content/site.ts'

export const feedPath = '/feed.xml'
export const feedTitle = `${site.name} · Notes`

export interface FeedEntry {
  title: string
  path: string
  summary: string
  published: string
  updated: string
}

function escapeXml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

/** Dates are whole days; the feed gives them as midnight UTC. */
function stamp(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Feed dates must be YYYY-MM-DD, got "${date}"`)
  return `${date}T00:00:00Z`
}

/** Atom 1.0 feed of the notes, newest first. */
export function buildAtomFeed(entries: readonly FeedEntry[], base: string = site.url): string {
  if (entries.length === 0) throw new Error('The feed needs at least one note')
  const sorted = [...entries].sort((a, b) => b.published.localeCompare(a.published))
  const updated =
    sorted
      .map((entry) => entry.updated)
      .sort()
      .at(-1) ?? ''
  const items = sorted.map((entry) => {
    const url = `${base}${entry.path}`
    return [
      '  <entry>',
      `    <title>${escapeXml(entry.title)}</title>`,
      `    <link rel="alternate" type="text/html" href="${url}"/>`,
      `    <id>${url}</id>`,
      `    <published>${stamp(entry.published)}</published>`,
      `    <updated>${stamp(entry.updated)}</updated>`,
      `    <summary>${escapeXml(entry.summary)}</summary>`,
      '  </entry>',
    ].join('\n')
  })
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${site.lang}">`,
    `  <title>${escapeXml(feedTitle)}</title>`,
    `  <subtitle>Technical notes on things I've built.</subtitle>`,
    `  <link rel="self" type="application/atom+xml" href="${base}${feedPath}"/>`,
    `  <link rel="alternate" type="text/html" href="${base}/notes/"/>`,
    `  <id>${base}/notes/</id>`,
    `  <updated>${stamp(updated)}</updated>`,
    `  <author>\n    <name>${escapeXml(site.name)}</name>\n    <uri>${base}/</uri>\n  </author>`,
    `  <icon>${base}/favicon-192.png</icon>`,
    ...items,
    '</feed>',
    '',
  ].join('\n')
}
