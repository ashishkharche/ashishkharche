// Compares the visible text of each page with another build of the site
// (for example the previous static version) and prints any differences.
// Usage: node scripts/compare-content.ts /path/to/other/site
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { sitemapPaths } from '../src/content/site.ts'

const other = process.argv[2]
if (!other) {
  console.error('Usage: node scripts/compare-content.ts /path/to/other/site')
  process.exit(2)
}

function words(html: string): string[] {
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'))
  return main
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .split(/\s+/)
    .filter(Boolean)
}

let differences = 0
for (const path of [...sitemapPaths, '404']) {
  const file = path === '404' ? '404.html' : join(path, 'index.html')
  const a = words(readFileSync(join(other, file), 'utf8')).join(' ')
  const b = words(readFileSync(join('dist/client', file), 'utf8')).join(' ')
  if (a === b) {
    console.log(`same   ${path}`)
    continue
  }
  differences++
  const aw = a.split(' ')
  const bw = b.split(' ')
  let start = 0
  while (aw[start] === bw[start]) start++
  let end = 0
  while (end < aw.length - start && aw[aw.length - 1 - end] === bw[bw.length - 1 - end]) end++
  console.log(`DIFF   ${path}`)
  console.log(`  other: …${aw.slice(Math.max(0, start - 4), aw.length - end + 4).join(' ')}…`)
  console.log(`  this:  …${bw.slice(Math.max(0, start - 4), bw.length - end + 4).join(' ')}…`)
}
process.exitCode = differences ? 1 : 0
