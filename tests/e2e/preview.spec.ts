import { expect, test } from '@playwright/test'
import { pngSize } from '../../src/lib/preview'
import { routes } from './routes'

const siteUrl = 'https://ashishkharche.com'

for (const path of routes) {
  test(`${path} has a valid absolute link preview image`, async ({ page, request }) => {
    await page.goto(path)
    const content = (selector: string) => page.locator(selector).getAttribute('content')
    const image = await content('meta[property="og:image"]')
    expect(image).toMatch(/^https:\/\/ashishkharche\.com\/assets\/.+\.png$/)
    expect(await content('meta[name="twitter:image"]')).toBe(image)
    expect(await content('meta[name="twitter:card"]')).toBe('summary_large_image')
    expect(await content('meta[property="og:title"]')).toBeTruthy()
    expect(await content('meta[property="og:description"]')).toBeTruthy()
    expect(await content('meta[property="og:image:alt"]')).toBeTruthy()
    // The image is fetched from the local build at the same path.
    const response = await request.get((image ?? '').slice(siteUrl.length))
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('image/png')
    expect(pngSize(await response.body())).toEqual({ width: 1200, height: 630 })
  })
}

test('the case study has its own preview card', async ({ page }) => {
  await page.goto('/projects/workout-director/')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    `${siteUrl}/assets/og/workout-director.png`,
  )
})
