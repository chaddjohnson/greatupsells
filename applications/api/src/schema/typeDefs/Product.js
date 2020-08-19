const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  type Product {
    _id: ID!
    shopifyShopId: Long!
    shopifyProductId: Long!
    title: String!
    shop: Shop
    shopifyProductData: JSON
    createdAt: DateTime
    updatedAt: DateTime
  }
`;

module.exports = typeDef;
