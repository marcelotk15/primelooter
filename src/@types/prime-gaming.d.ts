export interface PrimeCurrentUser {
  id: string
  isTwitchPrime?: boolean
  isAmazonPrime?: boolean
  isSignedIn?: boolean
  firstName: string
  twitchAccounts: TwitchAccount[]
  __typename: string
}

interface PrimeOfferAsset {
  type: string
  purpose: string
  location: string
  location2x: string
  __typename: string
}

interface OfferAssets {
  id: string
  pixels: any
  __typename: string
}

interface PrimeOfferTag {
  type: string
  tag: string
  __typename: string
}

interface PrimeOfferContent {
  externalURL?: string
  publisher: string
  categories: string[]
  __typename: string
}

interface PrimeOfferSelfEligibility {
  isClaimed: boolean
  canClaim: boolean
  isPrimeGaming: boolean
  missingRequiredAccountLink: boolean
  offerStartTime: string
  offerEndTime: string
  offerState: string
  gameAccountDisplayName: any
  inRestrictedMarketplace: boolean
  maxOrdersExceeded: boolean
  conflictingClaimAccount: any
  __typename: string
}

interface PrimeOfferSelf {
  claimInstructions: string
  orderInformation: any
  eligibility: PrimeOfferSelfEligibility
  __typename: string
}

interface PrimeOfferLinkedJourney {
  offers: PrimeOfferLinkedJourneyOffer[]
  __typename: string
}

interface PrimeOfferLinkedJourneyOfferSelfEligibility {
  canClaim: boolean
  isClaimed: boolean
  conflictingClaimAccount: any
  __typename: string
}

interface PrimeOfferLinkedJourneyOfferSelf {
  eligibility?: PrimeOfferLinkedJourneyOfferSelfEligibility
  __typename: string
}

interface PrimeOfferLinkedJourneyOffer {
  catalogId: string
  grantsCode: boolean
  self: PrimeOfferLinkedJourneyOfferSelf
  __typename: string
}

export interface PrimeOffer {
  catalogId: string
  id: string
  title: string
  assets: PrimeOfferAsset[]
  offerAssets: OfferAssets
  description: string
  deliveryMethod: string
  isRetailLinkOffer: boolean
  priority: number
  tags: PrimeOfferTag[]
  content: PrimeOfferContent
  startTime: string
  endTime: string
  self?: PrimeOfferSelf
  linkedJourney?: PrimeOfferLinkedJourney
  __typename: string
}

export interface PrimeOperationEntryPointsUser {
  currentUser: PrimeCurrentUser
}

export interface PrimeOperationOffersContext {
  primeOffers: PrimeOffer[]
}

interface JourneyOfferSelf {
  claimStatus: string
  orderInformation: any
  eligibility: Eligibility
  __typename: string
}

interface JourneyOfferAssets {
  additionalMedia: AdditionalMedum[]
  card: Card
  items?: string[]
  subtitle: string
  externalClaimLink: any
  title: string
  header?: string
  pixels?: any[]
  __typename: string
}

interface JourneyOffer {
  catalogId: string
  id: string
  startTime: string
  endTime: string
  grantsCode: boolean
  isFGWP: boolean
  self: JourneyOfferSelf
  assets: JourneyOfferAssets
  __typename: string
}

interface JourneyAssetsHeroMedia {
  src1x: string
  src2x: string
  type: string
  __typename: string
}

interface JourneyAssetsHero {
  defaultMedia: JourneyAssetsHeroMedia
  tablet: JourneyAssetsHeroMedia
  desktop: JourneyAssetsHeroMedia
  alt: any
  __typename: string
}

interface JourneyAssets {
  claimVisualInstructions: any
  hero: JourneyAssetsHero
  title: string
  subtitle: string
  description: string
  platformAvailability: string
  publisherName: string
  thirdPartyAccountManagementUrl: string
  claimInstructions: string
  purchaseGameText: any
  __typename: string
}

interface JourneyAccountLinkConfig {
  accountType: string
  linkedAccountConfirmation: string
  linkingInstructions: any
  linkingUrl: string
  __typename: string
}

interface JourneyGameAssets {
  title: string
  __typename: string
}

interface JourneyGameGameSelfConnection {
  isSubscribedToNotifications: boolean
  __typename: string
}

interface JourneyGame {
  id: string
  assets: JourneyGameAssets
  gameSelfConnection: JourneyGameGameSelfConnection
  __typename: string
}

export interface Journey {
  id: string
  offers: JourneyOffer[]
  assets: JourneyAssets
  accountLinkConfig: JourneyAccountLinkConfig
  game: JourneyGame
  __typename: string
}

export interface PrimeOpetaionOfferDetailJourney {
  journey: Journey
}
