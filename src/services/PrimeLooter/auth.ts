import type { Page } from 'puppeteer'

import { PrimeOperationEntryPointsUser } from '../../@types/prime-gaming'

export async function auth(page: Page) {
  await page.waitForResponse(async (response) => {
    if (!response.url().startsWith('https://gaming.amazon.com/graphql'))
      return false

    const { data } = (await response.json()) as {
      data: PrimeOperationEntryPointsUser
    }

    if (!data.currentUser) return false

    if (!data.currentUser.isSignedIn) {
      throw Error(
        'Authentication: Not signed in. (Please recreate the cookie.txt file)'
      )
    } else if (!data.currentUser.isAmazonPrime) {
      throw Error(
        'Authentication: Not a valid Amazon Prime account.\n (Loot can only be redeemed with an Amazon Prime Membership)'
      )
    } else if (!data.currentUser.isTwitchPrime) {
      throw Error(
        `Authentication: Not a valid Twitch Prime account.\n
        (Loot can only be redeemed with an Amazon Prime\n
        subscription and a connected Twitch Prime account)`
      )
    }

    return true
  })
}
