const {
  DateTimeResolver,
  JSONResolver,
  LongResolver
} = require('graphql-scalars');
const { shops, shop, shopOffers, shopProducts } = require('./shops');
const {
  offers,
  offer,
  offerShop,
  createOffer,
  updateOffer,
  deleteOffer
} = require('./offers');
const { offerAcceptances } = require('./offerHits');
const { products, product, productShop } = require('./products');

const resolvers = {
  DateTime: DateTimeResolver,
  JSON: JSONResolver,
  Long: LongResolver,
  Query: {
    shops,
    shop,
    offers,
    offer,
    offerAcceptances,
    products,
    product
  },
  Mutation: {
    createOffer,
    updateOffer,
    deleteOffer
  },
  Shop: {
    offers: shopOffers,
    products: shopProducts
  },
  Offer: {
    shop: offerShop
  },
  Product: {
    shop: productShop
  }
};

module.exports = resolvers;
