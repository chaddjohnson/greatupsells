import { gql } from 'apollo-boost';

export default gql`
  fragment ShopFragment on Shop {
    platformShopId
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
