const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  type OfferView {
    date: String!
    views: Int!
  }
`;

module.exports = typeDef;
