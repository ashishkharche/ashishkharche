import { expect, test } from '@playwright/test'
import { links } from '../../src/content/site'

// A recruiter on the home page should find the app's real links and its stack without scrolling far.
test('the home intro links to the App Store listing and the app website, with the stack', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const intro = page.locator('section[aria-labelledby="intro-title"]')
  const store = intro.getByRole('link', { name: 'App Store' })
  const website = intro.getByRole('link', { name: 'workoutdirector.com' })
  await expect(store).toHaveAttribute('href', links.workoutDirectorStore)
  await expect(website).toHaveAttribute('href', links.workoutDirectorSite)
  await expect(intro.getByRole('link', { name: 'Case study' })).toHaveAttribute('href', '/projects/workout-director/')
  const stack = intro.locator('p', { hasText: /^Built with/ })
  await expect(stack).toContainText('SwiftUI')
  await expect(stack).toBeInViewport()
  await expect(store).toBeInViewport()
})

test('the outside links on the project card open their own pages, not the case study', async ({ page }) => {
  await page.goto('/')
  const card = page.locator('article').filter({ hasText: 'Workout Director' }).first()
  for (const href of [links.workoutDirectorStore, links.workoutDirectorSite]) {
    const link = card.locator(`a[href="${href}"]`)
    await link.scrollIntoViewIfNeeded()
    const box = await link.boundingBox()
    if (!box) throw new Error('link is not on the page')
    const hit = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href'), {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    })
    expect(hit).toBe(href)
  }
})
