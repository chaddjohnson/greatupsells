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
    shops: [Shop]
    shop(id: ID): Shop
    offers: [Offer]
    offer(id: ID!): Offer
    offerAcceptances(
      id: ID!
      startAt: DateTime!
      endAt: DateTime!
    ): [OfferAcceptance]
    offerConversions(
      id: ID!
      startAt: DateTime!
      endAt: DateTime!
    ): [OfferConversion]
    offerConversionRates(
      id: ID!
      startAt: DateTime!
      endAt: DateTime!
    ): [OfferConversionRate]
    offerRevenueIncreases(
      id: ID!
      startAt: DateTime!
      endAt: DateTime!
    ): [OfferRevenueIncrease]
    offerViews(id: ID!, startAt: DateTime!, endAt: DateTime!): [OfferView]
    products: [Product]
    product(id: ID!): Product
    # login(username: String!, password: String!): User,
  }
`;

const Mutation = gql`
  type Mutation {
    createOffer(input: OfferInput!): Offer
    updateOffer(id: ID!, input: OfferInput!): Offer
    deleteOffer(id: ID!): Boolean
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
