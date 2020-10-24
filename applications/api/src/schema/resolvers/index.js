const {
  DateTimeResolver,
  JSONResolver,
  LongResolver
} = require('graphql-scalars');
const { shop } = require('./shops');
const {
  offers,
  offer,
  randomOffer,
  offerShop,
  offerProduct,
  createOffer,
  updateOffer,
  deleteOffer,
  shopOffers
} = require('./offers');
const {
  offerViews,
  offerAcceptances,
  offerConversions,
  offerConversionRates,
  offerRevenueIncreases,
  trackOfferView,
  trackOfferAcceptance
} = require('./offerHits');
const { products, product, productShop, shopProducts } = require('./products');

const resolvers = {
  DateTime: DateTimeResolver,
  JSON: JSONResolver,
  Long: LongResolver,
  Query: {
    shop,
    offers,
    offer,
    randomOffer,
    products,
    product
  },
  Mutation: {
    createOffer,
    updateOffer,
    deleteOffer,
    trackOfferView,
    trackOfferAcceptance
  },
  Shop: {
    offers: shopOffers,
    products: shopProducts
  },
  Offer: {
    shop: offerShop,
    product: offerProduct,
    views: offerViews,
    acceptances: offerAcceptances,
    conversions: offerConversions,
    conversionRates: offerConversionRates,
    revenueIncreases: offerRevenueIncreases
  },
  Product: {
    shop: productShop
  }
};

module.exports = resolvers;
