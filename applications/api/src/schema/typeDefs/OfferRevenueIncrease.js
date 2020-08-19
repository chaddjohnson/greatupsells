const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  type OfferRevenueIncrease {
    date: String!
    revenueIncrease: Float!
  }
`;

module.exports = typeDef;
