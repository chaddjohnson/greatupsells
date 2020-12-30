const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  type OfferAcceptance {
    date: String!
    acceptances: Int!
  }
`;

module.exports = typeDef;
