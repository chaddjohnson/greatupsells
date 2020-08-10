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
    uninstalledAt
    plan {
      level
      active
      chargeId
      billingOn
      upgradedAt
      canceledAt
      grandfatheredAt
    }
    createdAt
    updatedAt
  }
`;
