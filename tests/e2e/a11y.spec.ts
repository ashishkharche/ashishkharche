import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { routes } from './routes'

const themes = ['light', 'dark'] as const

for (const theme of themes) {
  for (const path of [...routes, '/no-such-page/']) {
    test(`${path} has no accessibility violations (${theme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze()
      const summary = results.violations.map(
        (v) => `${v.impact} ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
      )
      expect(summary).toEqual([])
    })
  }

  test(`theme picked with the toggle passes too (${theme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme === 'light' ? 'dark' : 'light', reducedMotion: 'reduce' })
    await page.goto('/projects/workout-director/')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Dark theme' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(results.violations.map((v) => `${v.impact} ${v.id}`)).toEqual([])
  })
}
