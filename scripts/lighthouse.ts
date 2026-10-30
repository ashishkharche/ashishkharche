// Lighthouse for every page, mobile and desktop, against the built site.
// Writes reports/lighthouse/summary.json and fails if any score is below the minimum.
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { setTimeout as sleep } from 'node:timers/promises'
import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'
import { sitemapPaths } from '../src/content/site.ts'

const minimum = Number(process.env.LH_MIN ?? 95)
const port = 4175
const server = spawn('node', ['scripts/serve.mjs'], { env: { ...process.env, PORT: String(port) }, stdio: 'ignore' })
await sleep(800)

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] })
const rows: Array<Record<string, string | number>> = []
let failed = false
try {
  const formFactors = (process.env.FORM_FACTORS?.split(',') ?? ['mobile', 'desktop']) as Array<'mobile' | 'desktop'>
  for (const formFactor of formFactors) {
    for (const path of sitemapPaths.filter((p) => !process.env.ONLY || process.env.ONLY.split(',').includes(p))) {
      const result = await lighthouse(
        `http://localhost:${port}${path}`,
        { port: chrome.port, output: 'json', logLevel: 'error' },
        {
          extends: 'lighthouse:default',
          settings: {
            formFactor,
            screenEmulation:
              formFactor === 'desktop'
                ? { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }
                : undefined,
            throttling:
              formFactor === 'desktop'
                ? {
                    rttMs: 40,
                    throughputKbps: 10240,
                    cpuSlowdownMultiplier: 1,
                    requestLatencyMs: 0,
                    downloadThroughputKbps: 0,
                    uploadThroughputKbps: 0,
                  }
                : undefined,
          },
        },
      )
      if (!result) throw new Error(`No Lighthouse result for ${path}`)
      const c = result.lhr.categories
      const scores = {
        performance: Math.round((c.performance?.score ?? 0) * 100),
        accessibility: Math.round((c.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((c['best-practices']?.score ?? 0) * 100),
        seo: Math.round((c.seo?.score ?? 0) * 100),
      }
      const audits = result.lhr.audits
      rows.push({
        formFactor,
        path,
        ...scores,
        lcp: audits['largest-contentful-paint']?.displayValue ?? '',
        tbt: audits['total-blocking-time']?.displayValue ?? '',
        cls: audits['cumulative-layout-shift']?.displayValue ?? '',
        failing: Object.values(audits)
          .filter((audit) => audit.score !== null && audit.score < 1 && audit.scoreDisplayMode === 'binary')
          .map((audit) => audit.id)
          .join(' '),
      })
      if (Object.values(scores).some((score) => score < minimum)) failed = true
    }
  }
} finally {
  await chrome.kill()
  server.kill()
}

await mkdir('reports/lighthouse', { recursive: true })
await writeFile('reports/lighthouse/summary.json', `${JSON.stringify(rows, null, 2)}\n`)
console.table(rows)
if (failed) {
  console.error(`Some scores are below ${minimum}.`)
  process.exitCode = 1
}
