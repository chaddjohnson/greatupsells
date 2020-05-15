const GraphQLJSON = require('graphql-type-json');
const { shops, shop, shopOffers, shopProducts, shopToken } = require('./shops');
const {
  offers,
  offer,
  offerShop,
  createOffer,
  updateOffer,
  deleteOffer
} = require('./offers');
const { products, product, productShop } = require('./products');

const resolvers = {
  Query: {
    shops,
    shop,
    offers,
    offer,
    products,
    product,
    shopToken
  },
  Mutation: {
    createOffer,
    updateOffer,
    deleteOffer
  },
  Offer: {
    shop: offerShop
  },
  Shop: {
    offers: shopOffers,
    products: shopProducts
  },
  Product: {
    shop: productShop
  },
  JSON: GraphQLJSON
};

module.exports = resolvers;
