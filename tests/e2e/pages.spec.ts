import { expect, test } from '@playwright/test'
import { headings, routes } from './routes'

for (const path of routes) {
  test(`${path} loads, has its heading and meta, and logs no errors`, async ({ page }) => {
    const problems: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') problems.push(msg.text())
    })
    page.on('pageerror', (error) => problems.push(error.message))

    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveText(headings[path])
    await expect(page.locator('main#main')).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://ashishkharche.com${path}`)
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://ashishkharche.com${path}`)
    await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveCount(1)
    expect(await page.title()).toContain('Ashish Kharche')
    await page.waitForLoadState('networkidle')
    expect(problems).toEqual([])
  })
}

test('unknown paths get the 404 page', async ({ page }) => {
  const response = await page.goto('/no-such-page/')
  expect(response?.status()).toBe(404)
  await expect(page.locator('h1')).toHaveText('Page not found.')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
})

test('links without a trailing slash redirect to the canonical URL', async ({ page }) => {
  await page.goto('/work')
  expect(new URL(page.url()).pathname).toBe('/work/')
})

test('client-side navigation works after hydration', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Notes' }).click()
  await expect(page).toHaveURL(/\/notes\/$/)
  await expect(page.locator('h1')).toHaveText('Notes')
  await expect(page.getByRole('link', { name: 'Notes' }).first()).toHaveAttribute('aria-current', 'page')
})

test('sitemap and robots are served', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const path of routes) expect(sitemap).toContain(`<loc>https://ashishkharche.com${path}</loc>`)
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Sitemap: https://ashishkharche.com/sitemap.xml')
})
