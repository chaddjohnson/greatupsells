export default /* GraphQL */ `
  fragment ShopFragment on Shop {
    shopifyShopId
    name
    domain
    alternateDomain
    contactName
    contactEmail
    contactPhone
    countryCode
    currency
    locale
    timezone
    active
    internal
    plan {
      level
      active
      chargeId
      billingOn
      upgradedAt
      canceledAt
    }
    uninstalledAt
    acceptanceCount
    conversionCount
    conversionRate
    revenueIncrease
    createdAt
    updatedAt
  }
`;
