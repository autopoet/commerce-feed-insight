import { expect, test } from '@playwright/test'

const baseUrl = 'http://localhost:5173'

test('ad entry to feed to dashboard funnel smoke flow', async ({ page }) => {
  await page.goto(baseUrl)
  await expect(page.getByRole('heading', { name: '创建一次广告推荐流转化实验' })).toBeVisible()
  await page.screenshot({ path: 'docs/screenshots/01-ad-entry.png', fullPage: true })

  await page.getByRole('button', { name: '启动实验流量' }).click()
  await expect(page.getByRole('heading', { name: '广告流量承接中的商品推荐流' })).toBeVisible()
  await page.waitForTimeout(1300)
  await page.screenshot({ path: 'docs/screenshots/02-feed.png', fullPage: true })

  const firstCard = page.locator('.product-card').first()
  await firstCard.click()
  await firstCard.getByRole('button', { name: '加购' }).click()
  await firstCard.getByRole('button', { name: '购买' }).click()

  await page.getByRole('link', { name: '查看实验结果' }).click()
  await expect(page.getByRole('heading', { name: '广告推荐流转化漏斗' })).toBeVisible()
  await expect(page.getByText('购买数', { exact: true })).toBeVisible()
  await expect(page.getByText('购买').first()).toBeVisible()
  await page.screenshot({ path: 'docs/screenshots/03-dashboard.png', fullPage: true })
})

test('mobile feed keeps compact two-column product cards', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(baseUrl)

  await page.getByRole('button', { name: '启动实验流量' }).click()
  await expect(page.getByRole('heading', { name: '广告流量承接中的商品推荐流' })).toBeVisible()
  await page.waitForTimeout(700)

  const firstCard = page.locator('.product-card').first()
  await expect(firstCard).toBeVisible()

  const cardBox = await firstCard.boundingBox()
  expect(cardBox).not.toBeNull()
  expect(cardBox!.height).toBeLessThanOrEqual(180)

  const imageBox = await firstCard.locator('.product-image').boundingBox()
  expect(imageBox).not.toBeNull()
  expect(imageBox!.width).toBeLessThan(140)

  await page.screenshot({ path: 'docs/screenshots/04-mobile-feed.png', fullPage: true })
})
