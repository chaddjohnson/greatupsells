const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  type OfferConversionRate {
    date: String!
    conversionRate: Float!
  }
`;

module.exports = typeDef;
