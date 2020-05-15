const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  type Product {
    _id: ID!
    platformShopId: ID!
    platformProductId: ID!
    title: String!
    shop: Shop
    shopifyProductData: JSON
    createdAt: String
    updatedAt: String
  }
`;

module.exports = typeDef;
