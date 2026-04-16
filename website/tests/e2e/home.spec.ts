import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'IOTA Trade Scanner', level: 1 })).toBeVisible()
})
