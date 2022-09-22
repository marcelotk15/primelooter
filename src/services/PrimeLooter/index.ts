import puppeteer from 'puppeteer-extra'

import { auth } from './auth'
import { getOffers } from './offers'
import { checkClaimStatus, checkEligibility } from './helpers'
import { claimDirect, claimExternal } from './clain'

import type { NetscapeJSON } from '../../@types/cookies'
import type { PrimeOperationOffersContext } from '../../@types/prime-gaming'

export async function primeLooter(cookies?: NetscapeJSON[], headless = true) {
  const browser = await puppeteer.launch({
    headless,
    defaultViewport: null,
    args: ['--start-maximized'],
  })

  const page = await browser.newPage()

  if (cookies) await page.setCookie(...cookies)

  const run = async () => {
    await page.goto('https://gaming.amazon.com/home')

    await auth(page)

    const offersResponse = await getOffers(page)

    const {
      data: { primeOffers },
    } = (await offersResponse.json()) as {
      data: PrimeOperationOffersContext
    }
    const notClaimedOffers = primeOffers.filter(
      (offer) => !offer.linkedJourney && !offer.self
    )
    const claimedOffers = primeOffers.filter(
      (offer) =>
        !notClaimedOffers.find(
          (notClaimedOffer) => notClaimedOffer === offer
        ) && checkClaimStatus(offer)
    )

    const externalOffers = primeOffers.filter(
      (offer) =>
        offer.deliveryMethod === 'EXTERNAL_OFFER' &&
        notClaimedOffers.find((notClaimedOffer) => notClaimedOffer !== offer) &&
        checkEligibility(offer)
    )

    const directOffers = primeOffers.filter(
      (offer) =>
        offer.deliveryMethod === 'DIRECT_ENTITLEMENT' && checkEligibility(offer)
    )

    notClaimedOffers.forEach((offer) =>
      console.log(`Can not claim these ingame offers: ${offer.title}`)
    )

    claimedOffers.forEach((offer) =>
      console.log(
        `The following offers have been claimed already: ${offer.title}`
      )
    )

    if (directOffers.length) {
      console.log(
        directOffers.reduce(
          (acc, offer) => `${acc}\n - ${offer.title}`,
          'Claiming these direct offers:'
        )
      )

      await claimDirect(page)
    } else {
      console.log('No direct offers to claim')
    }

    // TODO:
    //  # filter publishers
    // if "all" not in self.publishers:
    // external_offers = [offer for offer in external_offers if offer["content"]["publisher"] in self.publishers]

    if (externalOffers.length) {
      console.log(
        externalOffers.reduce(
          (acc, offer) => `${acc}\n - ${offer.title}`,
          'Claiming these external offers:'
        )
      )

      for await (const offer of externalOffers) {
        if (offer.content.externalURL)
          await claimExternal(
            offer.content.externalURL,
            offer.content.publisher,
            browser
          )
      }
    } else {
      console.log('No external offers to claim')
    }
  }

  const close = async () => await browser.close()

  return {
    close,
    run,
  }
}
