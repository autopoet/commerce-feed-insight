import { expect, test } from '@playwright/test'

const baseUrl = 'http://localhost:5173'

test('ad entry to feed to dashboard funnel smoke flow', async ({ page }) => {
  await page.goto(baseUrl)
  await expect(page.getByRole('heading', { name: '选择广告入口，观察后续转化链路。' })).toBeVisible()
  await page.screenshot({ path: 'docs/screenshots/01-ad-entry.png', fullPage: true })

  await page.getByRole('button', { name: '进入推荐流' }).click()
  await expect(page.getByRole('heading', { name: '电商商品推荐流' })).toBeVisible()
  await page.waitForTimeout(1300)
  await page.screenshot({ path: 'docs/screenshots/02-feed.png', fullPage: true })

  const firstCard = page.locator('.product-card').first()
  await firstCard.click()
  await firstCard.getByRole('button', { name: '加购' }).click()
  await firstCard.getByRole('button', { name: '购买' }).click()

  await page.getByRole('link', { name: '查看数据看板' }).click()
  await expect(page.getByRole('heading', { name: '转化漏斗分析' })).toBeVisible()
  await expect(page.getByText('购买数', { exact: true })).toBeVisible()
  await expect(page.getByText('购买').first()).toBeVisible()
  await page.screenshot({ path: 'docs/screenshots/03-dashboard.png', fullPage: true })
})
