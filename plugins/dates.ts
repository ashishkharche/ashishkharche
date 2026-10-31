import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { contentDates, noteDates } from '../src/lib/contentDates.ts'

const id = 'virtual:content-dates'
const root = fileURLToPath(new URL('..', import.meta.url))

/**
 * `import dates from 'virtual:content-dates'` gives each page's last-modified
 * date and each note's published and updated dates, worked out at build time
 * from frontmatter and git history.
 */
export function datesPlugin(): Plugin {
  return {
    name: 'site:content-dates',
    resolveId(source) {
      return source === id ? `\0${id}` : null
    },
    load(loaded) {
      if (loaded !== `\0${id}`) return null
      const slugs = readdirSync(`${root}content/notes`)
        .filter((name) => name.endsWith('.mdx'))
        .map((name) => name.slice(0, -4))
      const notes = Object.fromEntries(slugs.map((slug) => [slug, noteDates(slug, root)]))
      return `export default ${JSON.stringify({ pages: contentDates(root), notes })}`
    },
  }
}
