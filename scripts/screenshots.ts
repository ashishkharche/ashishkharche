// Full-page screenshots of every route at three widths, light and dark.
// Usage: node scripts/screenshots.ts [baseUrl] [outDir]
import { mkdir } from 'node:fs/promises'
import { chromium } from '@playwright/test'
import { sitemapPaths } from '../src/content/site.ts'

const base = process.argv[2] ?? 'http://localhost:4173'
const outDir = process.argv[3] ?? 'screenshots'
const widths = [375, 768, 1280]
const schemes = ['light', 'dark'] as const
const only = process.env.ONLY?.split(',')
const paths = [...sitemapPaths, '/404/'].filter((p) => !only || only.includes(p))
const widthList = process.env.WIDTHS?.split(',').map(Number) ?? widths
const schemeList = (process.env.SCHEMES?.split(',') as Array<'light' | 'dark'> | undefined) ?? schemes

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' })
const problems: string[] = []
for (const scheme of schemeList) {
  for (const width of widthList) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: scheme,
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning')
        problems.push(`${page.url()} ${msg.type()}: ${msg.text()}`)
    })
    page.on('pageerror', (err) => problems.push(`${page.url()} pageerror: ${err.message}`))
    for (const path of paths) {
      await page.goto(base + path, { waitUntil: 'networkidle' })
      await page.evaluate(() =>
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => img.setAttribute('loading', 'eager')),
      )
      // Scroll to the bottom and back so lazy images load before the capture.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y)
          await new Promise((resolve) => setTimeout(resolve, 60))
        }
        window.scrollTo(0, 0)
        await Promise.all(
          [...document.images].map((img) =>
            img.complete ? undefined : new Promise((resolve) => img.addEventListener('load', resolve, { once: true })),
          ),
        )
        await document.fonts.ready
      })
      const name = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replaceAll('/', '_')
      await page.screenshot({ path: `${outDir}/${name}-${width}-${scheme}.png`, fullPage: true })
    }
    await context.close()
  }
}
await browser.close()
console.log(
  problems.length ? `Console problems:\n${[...new Set(problems)].join('\n')}` : 'No console errors or warnings.',
)
