import { writeFileSync } from 'fs'
import { join } from 'path'
import type { Page } from 'puppeteer'

import { PrimeOffer } from '../../@types/prime-gaming'

export function checkEligibility(offer: PrimeOffer): boolean {
  if (offer.linkedJourney) {
    return !!offer.linkedJourney.offers.filter(
      (subOffer) => subOffer.self.eligibility?.canClaim
    ).length
  }

  if (offer.self) return offer.self.eligibility.canClaim

  return false
}

export function checkClaimStatus(offer: PrimeOffer): boolean {
  if (offer.linkedJourney) {
    return !!offer.linkedJourney.offers.filter(
      (subOffer) => subOffer.self.eligibility?.isClaimed
    ).length
  }

  if (offer.self) return offer.self.eligibility.isClaimed

  return false
}

export async function exists(page: Page, selector: string) {
  return !!(await page.$(selector))
}

export function codeToFile(
  gameName: string,
  code: string,
  instructions: string,
  separatorString = '========================'
) {
  const gameCodesFilePath = join(__dirname, '../../game-codes.txt')

  const toPutInfile = `\n${separatorString}\n${gameName}: ${code}\n\n${instructions.replace(
    '/n',
    ' '
  )}\n${separatorString}`

  writeFileSync(gameCodesFilePath, toPutInfile, {
    flag: 'a+',
    encoding: 'utf-8',
  })
}
