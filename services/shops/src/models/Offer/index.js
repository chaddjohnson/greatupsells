const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');
const findOneRandom = require('./findOneRandom');
const findOneRandomProduct = require('./findOneRandomProduct');
const calculateDiscountedPrice = require('./calculateDiscountedPrice');
const trackView = require('./trackView');
const toString = require('./toString');
const hooks = require('./hooks');

let Offer = null;

const offerProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: false },
  shopifyProductId: { type: Number, required: true }
});

const offerCollectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: false },
  shopifyCollectionId: { type: Number, required: true }
});

const schemaOptions = {
  timestamps: true
};
const schema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopifyShopId: { type: Number, required: true },
    name: { type: String, required: true },
    strategy: {
      type: String,
      required: true,
      enum: ['UPSELL', 'CROSS_SELL', 'POPUP']
    },
    viewCount: { type: Int32, required: true, default: 0, min: 0 },
    acceptanceCount: { type: Int32, required: true, default: 0, min: 0 },
    conversionCount: { type: Int32, required: true, default: 0, min: 0 },
    conversionRate: { type: Number, required: true, default: 0.0, min: 0 },
    revenueIncrease: { type: Number, required: true, default: 0.0, min: 0 },
    actionButtonBehavior: {
      type: String,
      enum: ['CART', 'CHECKOUT', 'PAGE', 'LINK'],
      required: true
    },
    actionButtonLink: {
      type: String,
      required() {
        return this.actionButtonBehavior === 'LINK';
      }
    },
    actionButtonLinkOpenInNewTab: {
      type: String,
      required() {
        return this.actionButtonBehavior === 'LINK';
      }
    },
    popupTheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PopupTheme',
      required: true
    },
    offeredProducts: [offerProductSchema],
    offeredCollections: [offerCollectionSchema],
    minimumProductsQuantity: { type: Int32, required: true },
    discountType: {
      type: String,
      enum: ['PERCENTAGE', 'USD', 'SET_PRICE', 'NO_DISCOUNT'],
      required: true
    },
    discountAmount: { type: Number, required: false },
    triggerEvent: {
      type: String,
      enum: ['ADD', 'CART', 'LOAD', 'EXIT'],
      required: true
    },
    triggerProducts: [offerProductSchema],
    triggerCollections: [offerCollectionSchema],
    enableGeotargeting: { type: Boolean, required: true, default: false },
    geotargetingCountries: [{ type: String, required: true }],
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: false },
    enableTimer: { type: Boolean, required: true },
    timerText: { type: String, required: false },
    timerCountdownStart: { type: Int32, required: false },
    allowWithDiscountCodes: { type: Boolean, required: true },
    allowMultipleUpsells: { type: Boolean, required: true },
    hideIfItemAdded: { type: Boolean, required: true },
    showNotificationBanner: { type: Boolean, required: true },
    enableQuantitySelection: { type: Boolean, required: true },
    limitQuantitySelection: { type: Boolean, required: true },
    productQuantityLimit: { type: Int32, required: false },
    enableProductLinks: { type: Boolean, required: true },
    hideOutOfStockProducts: { type: Boolean, required: true },
    // discountCodes
    // discountPricingMethod
    enabled: { type: Boolean, required: true, default: true }
  },
  schemaOptions
);

schema.statics.findByShopifyShopId = function (shopifyShopId) {
  return Offer.find({ shopifyShopId });
};

schema.statics.findByShopId = function (shopId) {
  return Offer.find({ shop: mongoose.Types.ObjectId(shopId) });
};

schema.statics.findOneRandom = function (
  shop,
  triggerEvent,
  shopifyProductIds,
  ipAddress
) {
  return findOneRandom(shop, triggerEvent, shopifyProductIds, ipAddress);
};

schema.methods.findOneRandomProduct = function () {
  return findOneRandomProduct(this);
};

schema.methods.calculateDiscountedPrice = function (price) {
  return calculateDiscountedPrice(this, price);
};

schema.methods.findViews = async function (startAt, endAt) {
  const OfferHit = mongodbClient.connection.model('OfferHit');

  return OfferHit.findViewsByOfferId(this._id, startAt, endAt);
};

schema.methods.findAcceptances = async function (startAt, endAt) {
  const OfferHit = mongodbClient.connection.model('OfferHit');

  return OfferHit.findAcceptancesByOfferId(this._id, startAt, endAt);
};

schema.methods.findRevenueIncreases = async function (startAt, endAt) {
  const OfferHit = mongodbClient.connection.model('OfferHit');

  return OfferHit.findRevenueIncreasesByOfferId(this._id, startAt, endAt);
};

schema.methods.findConversions = async function (startAt, endAt) {
  const OfferHit = mongodbClient.connection.model('OfferHit');

  return OfferHit.findConversionsByOfferId(this._id, startAt, endAt);
};

schema.methods.findConversionRates = async function (startAt, endAt) {
  const OfferHit = mongodbClient.connection.model('OfferHit');

  return OfferHit.findConversionRatesByOfferId(this._id, startAt, endAt);
};

schema.methods.trackView = function (
  shopifyProductId,
  shopifyVariantId,
  ipAddress
) {
  return trackView(this, shopifyProductId, shopifyVariantId, ipAddress);
};

schema.methods.toString = function () {
  return toString(this);
};

schema.pre('validate', function (next) {
  hooks.preValidate(this, next);
});

schema.index({ shop: 1 });
schema.index({ shopifyShopId: 1 });
schema.index({ shop: 1, triggerEvent: 1 });
schema.index({ createdAt: -1 });

Offer = mongodbClient.connection.model('Offer', schema);

module.exports = Offer;
