const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  type OfferConversion {
    date: String!
    conversions: Int!
  }
`;

module.exports = typeDef;
