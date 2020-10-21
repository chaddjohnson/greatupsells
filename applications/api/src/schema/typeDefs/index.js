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

const Query = gql`
  type Query {
    shop(id: ID): Shop
    offers: [Offer]
    offer(id: ID!): Offer
    randomOffer(event: String!, shopifyProductIds: [Long!]!): Offer
    products: [Product]
    product(id: ID!): Product
  }
`;

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

module.exports = [
  DateTimeTypeDefinition,
  JSONDefinition,
  LongTypeDefinition,
  Shop,
  Offer,
  OfferAcceptance,
  OfferConversion,
  OfferConversionRate,
  OfferRevenueIncrease,
  OfferView,
  Product,
  Query,
  Mutation
];
