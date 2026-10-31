import { expect, test } from '@playwright/test'

test('the screen rows scroll with the buttons and the keyboard', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/projects/workout-director/')
  const rail = page.getByRole('group', { name: 'iPhone screens, scrolls sideways' })
  const previous = page.getByRole('button', { name: 'Previous iPhone screens' })
  const next = page.getByRole('button', { name: 'Next iPhone screens' })
  await rail.scrollIntoViewIfNeeded()
  await expect(previous).toHaveAttribute('aria-disabled', 'true')
  await next.click()
  await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
  await expect(previous).toHaveAttribute('aria-disabled', 'false')

  await rail.evaluate((el) => el.scrollTo({ left: 0 }))
  await rail.focus()
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
})

test('every screen has alt text and a fixed size', async ({ page }) => {
  await page.goto('/projects/workout-director/')
  const images = page.locator('picture img')
  expect(await images.count()).toBeGreaterThan(14)
  for (const img of await images.all()) {
    expect(await img.getAttribute('alt')).toBeTruthy()
    expect(Number(await img.getAttribute('width'))).toBeGreaterThan(0)
    expect(Number(await img.getAttribute('height'))).toBeGreaterThan(0)
  }
})
