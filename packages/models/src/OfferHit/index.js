const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;
const findViewsByOfferId = require('./findViewsByOfferId');
const findAcceptancesByOfferId = require('./findAcceptancesByOfferId');
const findRevenueIncreasesByOfferId = require('./findRevenueIncreasesByOfferId');
const findConversionsByOfferId = require('./findConversionsByOfferId');
const findConversionRatesByOfferId = require('./findConversionRatesByOfferId');
const trackOriginalProduct = require('./trackOriginalProduct');
const trackAcceptedProduct = require('./trackAcceptedProduct');
const trackAcceptance = require('./trackAcceptance');
const trackConversion = require('./trackConversion');

require('mongoose-long')(mongoose);

const mongodbClient = mongodbClientFactory.get(process.env.MONGODB_URI);

let OfferHit = null;

const schemaOptions = {
  timestamps: true,
  collection: 'offerHits'
};
const schema = new mongoose.Schema(
  {
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      required: true
    },
    shopifyShopId: { type: mongoose.Schema.Types.Long, required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    triggerEvent: {
      type: String,
      enum: ['ADD', 'CART', 'CHECKOUT', 'LOAD', 'EXIT'],
      required: true
    },
    strategy: { type: String, required: true, enum: ['UPSELL', 'CROSS_SELL'] },
    originalShopifyProductId: {
      type: mongoose.Schema.Types.Long,
      required: false
    },
    originalShopifyProductVariantId: {
      type: mongoose.Schema.Types.Long,
      required: false
    },
    originalShopifyProductVariantPrice: { type: Number, required: false },
    acceptedShopifyProductId: {
      type: mongoose.Schema.Types.Long,
      required: false
    },
    acceptedShopifyProductVariantId: {
      type: mongoose.Schema.Types.Long,
      required: false
    },
    acceptedShopifyProductVariantPrice: { type: Number, required: false },
    acceptedShopifyProductQuantity: { type: Number, required: false },
    shopifyOrderId: { type: mongoose.Schema.Types.Long, required: false },
    shopifyOrderNumber: { type: Int32, required: false },
    ipAddress: { type: String, required: false },
    acceptedAt: { type: Date, required: false },
    convertedAt: { type: Date, required: false },
    revenueIncrease: { type: Number, required: false, min: 0 }
  },
  schemaOptions
);

schema.statics.findByShopifyShopId = function (shopifyShopId) {
  return OfferHit.find({ shopifyShopId });
};

schema.statics.findByOfferId = function (offerId) {
  return OfferHit.find({ offer: offerId });
};

schema.statics.findByShopifyProductId = function (shopifyProductId) {
  return OfferHit.findOne({ shopifyProductId });
};

schema.statics.findViewsByOfferId = function (offerId, startAt, endAt) {
  return findViewsByOfferId(offerId, startAt, endAt);
};

schema.statics.findAcceptancesByOfferId = function (offerId, startAt, endAt) {
  return findAcceptancesByOfferId(offerId, startAt, endAt);
};

schema.statics.findRevenueIncreasesByOfferId = function (
  offerId,
  startAt,
  endAt
) {
  return findRevenueIncreasesByOfferId(offerId, startAt, endAt);
};

schema.statics.findConversionsByOfferId = function (offerId, startAt, endAt) {
  return findConversionsByOfferId(offerId, startAt, endAt);
};

schema.statics.findConversionRatesByOfferId = function (
  offerId,
  startAt,
  endAt
) {
  return findConversionRatesByOfferId(offerId, startAt, endAt);
};

schema.methods.trackOriginalProduct = function (
  shopifyProductId,
  shopifyVariantId
) {
  return trackOriginalProduct(this, shopifyProductId, shopifyVariantId);
};

schema.methods.trackAcceptedProduct = function (
  shopifyProductId,
  shopifyVariantId,
  quantity
) {
  return trackAcceptedProduct(
    this,
    shopifyProductId,
    shopifyVariantId,
    quantity
  );
};

schema.methods.trackAcceptance = function (
  shopifyProductId,
  shopifyVariantId,
  quantity
) {
  return trackAcceptance(this, shopifyProductId, shopifyVariantId, quantity);
};

schema.methods.trackConversion = function (order) {
  return trackConversion(this, order);
};

// TODO: Validate values conditionally based on offer.
// schema.pre('validate', function (next) {
//   hooks.preValidate(this, next);
// });

schema.index({ shopifyShopId: 1, ipAddress: 1 });
schema.index({ shopifyProductId: 1 }, { unique: true, sparse: true });

OfferHit = mongodbClient.connection.model('OfferHit', schema);

module.exports = OfferHit;
