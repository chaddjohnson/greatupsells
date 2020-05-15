const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  type Token {
    token: String!
  }
`;

module.exports = typeDef;
