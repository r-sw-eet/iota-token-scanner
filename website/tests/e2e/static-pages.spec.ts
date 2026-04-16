import { test, expect } from '@playwright/test'

test('imprint page renders', async ({ page }) => {
  await page.goto('/imprint')
  await expect(page.getByRole('heading', { name: 'Imprint', level: 1 })).toBeVisible()
  await expect(page).toHaveTitle(/Imprint/)
})

test('privacy page renders', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible()
  await expect(page).toHaveTitle(/Privacy/)
})
