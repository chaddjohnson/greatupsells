const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');
const findViewsByOfferId = require('./findViewsByOfferId');
const findAcceptancesByOfferId = require('./findAcceptancesByOfferId');
const findRevenueIncreasesByOfferId = require('./findRevenueIncreasesByOfferId');
const findConversionsByOfferId = require('./findConversionsByOfferId');
const findConversionRatesByOfferId = require('./findConversionRatesByOfferId');
const trackOriginalProduct = require('./trackOriginalProduct');
const trackAcceptedProduct = require('./trackAcceptedProduct');
const trackAcceptance = require('./trackAcceptance');
const trackConversion = require('./trackConversion');

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
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopifyShopId: { type: Number, required: true },
    triggerEvent: {
      type: String,
      enum: ['ADD', 'CART', 'CHECKOUT', 'LOAD', 'EXIT'],
      required: true
    },
    strategy: { type: String, required: true, enum: ['UPSELL', 'CROSS_SELL'] },
    originalShopifyProductId: { type: Number, required: false },
    originalShopifyVariantId: { type: Number, required: false },
    originalShopifyVariantPrice: { type: Number, required: false },
    acceptedShopifyProductId: { type: Number, required: false },
    acceptedShopifyVariantId: { type: Number, required: false },
    acceptedShopifyVariantPrice: { type: Number, required: false },
    acceptedShopifyProductQuantity: { type: Number, required: false },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    shopifyOrderId: { type: Number, required: false },
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
  return OfferHit.find({ offer: mongoose.Types.ObjectId(offerId) });
};

schema.statics.findByOrderId = function (orderId) {
  return OfferHit.find({ order: mongoose.Types.ObjectId(orderId) });
};

schema.statics.findByShopifyOrderId = function (shopifyOrderId) {
  return OfferHit.find({ shopifyOrderId });
};

schema.statics.findByAcceptedVariantId = function (shopifyVariantId) {
  return OfferHit.findOne({ acceptedShopifyVariantId: shopifyVariantId });
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

schema.index({ offer: 1 });
schema.index({ shop: 1, ipAddress: 1 });
schema.index({ acceptedShopifyVariantId: 1 });
schema.index({ order: 1 });

OfferHit = mongodbClient.connection.model('OfferHit', schema);

module.exports = OfferHit;
