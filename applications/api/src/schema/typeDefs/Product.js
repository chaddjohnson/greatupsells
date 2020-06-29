const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  type Product {
    _id: ID!
    shopifyShopId: ID!
    shopifyProductId: ID!
    title: String!
    shop: Shop
    shopifyProductData: JSON
    createdAt: String
    updatedAt: String
  }
`;

module.exports = typeDef;
