import type { Browser, Page } from 'puppeteer'

import { PrimeOpetaionOfferDetailJourney } from '../../@types/prime-gaming'
import { codeToFile, exists } from './helpers'

export async function clainPageResponse(page: Page) {
  return await page.waitForResponse(async (response) => {
    if (!response.url().startsWith('https://gaming.amazon.com/graphql'))
      return false

    const { data } = await response.json()

    return !!data.journey
  })
}

export async function claimExternal(
  url: string,
  publisher: string,
  browser: Browser
) {
  if (!url.includes('loot')) {
    console.log(`
      Skipping URL ${url}, looks to not be a game URL.\n
      Please report @github if this appears to be a mistake!
    `)

    return
  }

  let gameName
  let page

  try {
    page = await browser.newPage()

    await page.goto(url)

    const pageResponse = await clainPageResponse(page)

    const {
      data: { journey },
    } = (await pageResponse.json()) as {
      data: PrimeOpetaionOfferDetailJourney
    }

    gameName = journey.assets.title

    console.log(`Try to claim ${gameName}`)

    await page.waitForSelector('div[data-a-target=loot-card-available]')

    const lootCards = await page.$$('div[data-a-target=loot-card-available]')

    for await (const lootCard of lootCards) {
      const lootName = await lootCard.$eval(
        'h3[data-a-target=LootCardSubtitle]',
        (node) => node.textContent
      )

      console.log(
        `Try to claim loot '${lootName}' from ${gameName} by ${publisher}`
      )

      const clainButton = await lootCard.$(
        'button[data-a-target=AvailableButton]'
      )

      if (!clainButton) {
        console.warn(
          `Could not claim '${lootName}' from ${gameName} by ${publisher} (in-game loot)`
        )

        return
      }

      setTimeout(async () => {
        await clainButton.click()
      }, 500)

      await page.waitForSelector('div[data-a-target=gms-base-modal]', {
        timeout: 10000,
      })

      if (
        await exists(page, 'div[class*="--current"][data-a-target="Step-3"]')
      ) {
        const completClainButton = await lootCard.$(
          'button[data-a-target=AvailableButton]'
        )

        if (completClainButton) completClainButton.click()
      }

      if (await exists(page, 'div.gms-success-modal-container')) {
        console.log(`Claimed ${lootName} (${gameName})`)

        if (await exists(page, 'div.get-my-stuff-modal-code-success')) {
          const code = (await page.$eval(
            'div.get-my-stuff-modal-code div[data-a-target="copy-code-input"] input',
            (node) => node.getAttribute('value')?.trim()
          )) as string

          const instructions = (await page.$eval(
            'div[data-a-target=gms-claim-instructions]',
            (node) => node.textContent?.trim()
          )) as string

          codeToFile(gameName, code, instructions)
        }
      } else if (
        (await exists(
          page,
          'div[class*="--current"][data-a-target="Step-2"]'
        )) ||
        (await exists(page, 'div[data-a-target=gms-progress-bar]'))
      ) {
        console.warn(
          `Could not claim ${lootName} from ${gameName} by ${publisher} (account not connected)`
        )
      } else {
        console.warn(
          `Could not claim ${lootName} from ${gameName} by ${publisher} (unknown error)`
        )
      }
    }
  } catch (error) {
    console.error(error)

    console.error(`
      An error occured (${publisher}/${gameName})! Did they make some changes to the website?\n
      Please report @github if this happens multiple times.
    `)
  } finally {
    page?.close()
  }
}

export async function claimDirect(page: Page) {
  await page.click('button[data-type="Game"]')

  const directOffers = Array.from(
    (
      await (
        await page.evaluateHandle(() =>
          Array.from(
            document.querySelectorAll(
              "div[data-a-target='offer-list-FGWP_FULL'] > div[class='offer-list__content__grid'] > div[class='tw-block']"
            )
          ).filter(
            (element) =>
              !!element.querySelector("button[data-a-target='FGWPOffer']")
          )
        )
      ).getProperties()
    ).values()
  )

  if (!directOffers || !directOffers.length) {
    console.log(
      'No direct offers found! Did they make some changes to the website?\nPlease report @github if this happens multiple times.'
    )

    return
  }

  for await (const directOffer of directOffers) {
    const gameName = await directOffer
      .asElement()
      ?.$eval('h3', (node) => node.innerText)

    console.log(`Try to claim ${gameName}`)

    const directOfferButton = await directOffer
      .asElement()
      ?.$("button[data-a-target='FGWPOffer']")

    await directOfferButton?.click()

    console.log(`Claimed ${gameName}`)
  }
}
