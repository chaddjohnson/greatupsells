const { gql } = require('apollo-server-lambda');
const {
  DateTimeTypeDefinition,
  JSONDefinition,
  LongTypeDefinition
} = require('graphql-scalars');
const Shop = require('./Shop');
const Offer = require('./Offer');
const OfferAcceptance = require('./OfferAcceptance');
const OfferConversion = require('./OfferConversion');
const OfferConversionRate = require('./OfferConversionRate');
const OfferRevenueIncrease = require('./OfferRevenueIncrease');
const OfferView = require('./OfferView');
const Product = require('./Product');

// Declare queries.
const Query = gql`
  type Query {
    shop(id: ID): Shop
    offers: [Offer]
    offer(id: ID!): Offer
    randomOffer(event: String!, shopifyProductIds: [Long!]!): Offer
    views(date: String, views: Int!): [OfferView]
    acceptances(date: String!, acceptances: Int!): [OfferAcceptance]
    conversions(date: String!, conversions: Int!): [OfferConversion]
    conversionRates(
      date: String!
      conversionRate: Float!
    ): [OfferConversionRate]
    revenueIncreases(
      date: String!
      revenueIncrease: Float!
    ): [OfferRevenueIncrease]
    products: [Product]
    product(id: ID!): Product
  }
`;

// Declare mutations.
const Mutation = gql`
  type Mutation {
    createOffer(input: OfferInput!): Offer
    updateOffer(id: ID!, input: OfferInput!): Offer
    deleteOffer(id: ID!): Boolean
    trackOfferView(offerId: ID!, productId: Long, variantId: Long): Boolean
    trackOfferAcceptance(
      offerHitId: ID!
      productId: Long
      variantId: Long
      quantity: Int
    ): Boolean
  }
`;

// TODO: Role authorization

// Export types.
module.exports = [
  DateTimeTypeDefinition,
  JSONDefinition,
  LongTypeDefinition,
  Shop,
  Offer,
  OfferView,
  OfferAcceptance,
  OfferConversion,
  OfferConversionRate,
  OfferRevenueIncrease,
  Product,
  Query,
  Mutation
];
