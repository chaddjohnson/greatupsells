const { gql } = require('apollo-server-lambda');
const { DateTimeTypeDefinition, JSONDefinition } = require('graphql-scalars');
const Shop = require('./Shop');
const Offer = require('./Offer');
const Product = require('./Product');

const Query = gql`
  type Query {
    shops: [Shop]
    shop(id: ID): Shop
    offers: [Offer]
    offer(id: ID!): Offer
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
  Shop,
  Offer,
  Product,
  Query,
  Mutation
];
