const { DateTimeResolver, JSONResolver } = require('graphql-scalars');
const { shops, shop, shopOffers, shopProducts } = require('./shops');
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
  DateTime: DateTimeResolver,
  JSON: JSONResolver,
  Query: {
    shops,
    shop,
    offers,
    offer,
    products,
    product
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
  }
};

module.exports = resolvers;
