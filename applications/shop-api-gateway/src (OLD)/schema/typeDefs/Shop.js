const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  type Shop {
    _id: ID!
    shopifyShopId: Long!
    name: String!
    domain: String!
    alternateDomain: String
    contactName: String!
    contactEmail: String!
    contactPhone: String
    countryCode: String!
    currency: String!
    locale: String!
    timezone: String!
    active: Boolean!
    internal: Boolean!
    shopifyPlan: String!
    plan: ShopPlan!
    uninstalledAt: DateTime
    offerViewCount: Int
    offerAcceptanceCount: Int
    offerConversionCount: Int
    offerConversionRate: Float
    revenueIncrease: Float
    createdAt: DateTime!
    updatedAt: DateTime!
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
  }

  enum ShopPlanLevel {
    FREE
    BASIC
    PLUS
    PRO
  }
`;

module.exports = typeDef;
