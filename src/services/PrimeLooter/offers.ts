import type { Page } from 'puppeteer'

export async function getOffers(page: Page) {
  return await page.waitForResponse(async (response) => {
    if (!response.url().startsWith('https://gaming.amazon.com/graphql'))
      return false

    const { data } = await response.json()

    return !!data.primeOffers
  })
}
