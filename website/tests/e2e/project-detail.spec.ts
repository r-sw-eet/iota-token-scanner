import { test, expect } from '@playwright/test'

const project = {
  slug: 'aa-tlip-trade',
  name: 'TLIP (Trade)',
  layer: 'L1',
  category: 'Trade Finance',
  description: 'Trade Logistics Information Pipeline — a test-mocked description.',
  urls: [{ label: 'Website', href: 'https://tlip.io' }],
  packages: 1,
  packageAddress: '0xaa',
  latestPackageAddress: '0xaa',
  storageIota: 0,
  events: 42,
  eventsCapped: false,
  modules: ['ebl'],
  tvl: null,
  team: { id: 'if-tlip', name: 'IOTA Foundation (TLIP)' },
}

test('project detail page loads mocked project data', async ({ page }) => {
  await page.route('**/api/v1/ecosystem/project/aa-tlip-trade', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(project) }),
  )
  await page.route('**/api/v1/ecosystem/project/aa-tlip-trade/events**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ events: [], module: '0xaa::ebl' }),
    }),
  )

  await page.goto('/project/aa-tlip-trade')

  await expect(page.getByRole('heading', { name: 'TLIP (Trade)', level: 1 })).toBeVisible()
  await expect(page.getByText('Trade Finance')).toBeVisible()
})
