export default /* GraphQL */ `
  fragment ShopFragment on Shop {
    shopifyShopId
    name
    domain
    realDomain
    contactName
    contactEmail
    contactPhone
    countryCode
    currency
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
      grandfatheredAt
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
