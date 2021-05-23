const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');
const findAcceptancesByOfferId = require('./findAcceptancesByOfferId');
const findAcceptancesByShopId = require('./findAcceptancesByShopId');
const findImpressionsByOfferId = require('./findImpressionsByOfferId');
const findImpressionsByShopId = require('./findImpressionsByShopId');
const findRevenueIncreasesByOfferId = require('./findRevenueIncreasesByOfferId');
const findRevenueIncreasesByShopId = require('./findRevenueIncreasesByShopId');
const findConversionsByOfferId = require('./findConversionsByOfferId');
const findConversionsByShopId = require('./findConversionsByShopId');
const findConversionRatesByOfferId = require('./findConversionRatesByOfferId');
const findConversionRatesByShopId = require('./findConversionRatesByShopId');
const trackOfferedProducts = require('./trackOfferedProducts');
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
    strategy: {
      type: String,
      required: true,
      enum: ['UPSELL', 'CROSS_SELL', 'POPUP']
    },
    triggerEvent: {
      type: String,
      required: true,
      enum: ['ADD', 'EXIT', 'LOAD', 'FOCUS', 'SCROLL', 'LINK']
    },
    triggerPagePath: { type: String, required: false },
    triggerShopifyProductId: { type: Number, required: false },
    offeredProducts: [
      {
        shopifyProductId: { type: Number, required: true },
        shopifyVariantId: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    originalProducts: [
      {
        shopifyProductId: { type: Number, required: true },
        shopifyVariantId: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    acceptedProducts: [
      {
        shopifyProductId: { type: Number, required: true },
        shopifyVariantId: { type: Number, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false
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
  return OfferHit.find({ shopifyShopId: parseInt(shopifyShopId) });
};

schema.statics.findByOfferId = function (offerId) {
  return OfferHit.find({ offer: mongoose.Types.ObjectId(offerId) });
};

schema.statics.findByOrderId = function (orderId) {
  return OfferHit.find({ order: mongoose.Types.ObjectId(orderId) });
};

schema.statics.findOneByAcceptedVariantId = function (shopifyVariantId) {
  return OfferHit.findOne({
    'acceptedProducts.shopifyVariantId': parseInt(shopifyVariantId)
  });
};

schema.statics.findImpressionsByOfferId = function (offerId, startAt, endAt) {
  return findImpressionsByOfferId(offerId, startAt, endAt);
};

schema.statics.findImpressionsByShopId = function (shopId, startAt, endAt) {
  return findImpressionsByShopId(shopId, startAt, endAt);
};

schema.statics.findAcceptancesByOfferId = function (offerId, startAt, endAt) {
  return findAcceptancesByOfferId(offerId, startAt, endAt);
};

schema.statics.findAcceptancesByShopId = function (shopId, startAt, endAt) {
  return findAcceptancesByShopId(shopId, startAt, endAt);
};

schema.statics.findRevenueIncreasesByOfferId = function (
  offerId,
  startAt,
  endAt
) {
  return findRevenueIncreasesByOfferId(offerId, startAt, endAt);
};

schema.statics.findRevenueIncreasesByShopId = function (
  shopId,
  startAt,
  endAt
) {
  return findRevenueIncreasesByShopId(shopId, startAt, endAt);
};

schema.statics.findConversionsByOfferId = function (offerId, startAt, endAt) {
  return findConversionsByOfferId(offerId, startAt, endAt);
};

schema.statics.findConversionsByShopId = function (shopId, startAt, endAt) {
  return findConversionsByShopId(shopId, startAt, endAt);
};

schema.statics.findConversionRatesByOfferId = function (
  offerId,
  startAt,
  endAt
) {
  return findConversionRatesByOfferId(offerId, startAt, endAt);
};

schema.statics.findConversionRatesByShopId = function (shopId, startAt, endAt) {
  return findConversionRatesByShopId(shopId, startAt, endAt);
};

schema.methods.trackOfferedProducts = function (
  shopifyProductIds,
  shopifyVariantIds
) {
  return trackOfferedProducts(this, shopifyProductIds, shopifyVariantIds);
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

schema.index({ shop: 1 });
schema.index({ offer: 1 });
schema.index({ order: 1 });
schema.index({ acceptedShopifyVariantId: 1 });

OfferHit = mongodbClient.connection.model('OfferHit', schema);

module.exports = OfferHit;
