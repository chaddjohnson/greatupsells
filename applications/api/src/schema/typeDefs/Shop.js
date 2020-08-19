const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  type Shop {
    _id: ID!
    shopifyShopId: Long!
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
    plan: ShopPlan!
    uninstalledAt: DateTime
    acceptanceCount: Int
    conversionCount: Int
    conversionRate: Float
    revenueIncrease: Float
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
