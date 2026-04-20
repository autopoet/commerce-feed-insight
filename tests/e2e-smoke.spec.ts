import { expect, test } from '@playwright/test'

const baseUrl = 'http://localhost:5173'

test('ad entry to feed to dashboard funnel smoke flow', async ({ page }) => {
  await page.goto(baseUrl)
  await expect(page.getByRole('heading', { name: /Select an ad entry/i })).toBeVisible()
  await page.screenshot({ path: 'docs/screenshots/01-ad-entry.png', fullPage: true })

  await page.getByRole('button', { name: 'Enter Feed' }).click()
  await expect(page.getByRole('heading', { name: 'Product Feed' })).toBeVisible()
  await page.waitForTimeout(1300)
  await page.screenshot({ path: 'docs/screenshots/02-feed.png', fullPage: true })

  const firstCard = page.locator('.product-card').first()
  await firstCard.click()
  await firstCard.getByRole('button', { name: 'Cart' }).click()
  await firstCard.getByRole('button', { name: 'Buy' }).click()

  await page.getByRole('link', { name: /Dashboard/i }).click()
  await expect(page.getByRole('heading', { name: 'Conversion Funnel' })).toBeVisible()
  await expect(page.getByText('Purchases', { exact: true })).toBeVisible()
  await expect(page.getByText('Purchase').first()).toBeVisible()
  await page.screenshot({ path: 'docs/screenshots/03-dashboard.png', fullPage: true })
})
