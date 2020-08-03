const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  type Shop {
    _id: ID!
    shopifyShopId: ID!
    name: String!
    domain: String!
    realDomain: String
    contactName: String!
    contactEmail: String!
    contactPhone: String
    countryCode: String!
    currency: String!
    timezone: String!
    active: Boolean!
    internal: Boolean!
    uninstalledAt: DateTime
    plan: ShopPlan!
    createdAt: DateTime
    updatedAt: DateTime
    offers: [Offer]
    products: [Product]
  }

  type ShopPlan {
    level: ShopPlanLevel!
    active: Boolean
    chargeId: ID
    billingOn: String
    upgradedAt: DateTime
    canceledAt: DateTime
    grandfatheredAt: DateTime
  }

  enum ShopPlanLevel {
    FREE
    PREMIUM
  }
`;

module.exports = typeDef;
