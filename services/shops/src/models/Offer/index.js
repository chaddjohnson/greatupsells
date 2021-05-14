const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');
const findOneRandom = require('./findOneRandom');
const findRandomProducts = require('./findRandomProducts');
const calculateDiscountedPrice = require('./calculateDiscountedPrice');
const trackImpression = require('./trackImpression');
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
      enum: ['CROSS_SELL', 'UPSELL', 'POPUP']
    },
    impressionCount: { type: Int32, required: true, default: 0, min: 0 },
    acceptanceCount: { type: Int32, required: true, default: 0, min: 0 },
    conversionCount: { type: Int32, required: true, default: 0, min: 0 },
    conversionRate: { type: Number, required: true, default: 0.0, min: 0 },
    revenueIncrease: { type: Number, required: true, default: 0.0, min: 0 },
    actionButtonBehavior: {
      type: String,
      required: true,
      enum: ['CART', 'CHECKOUT', 'PAGE', 'LINK']
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
    viewAllowance: {
      type: String,
      required: true,
      default: 'DAYS',
      enum: ['DAYS', 'SESSION', 'ONCE', 'PAGE']
    },
    viewAllowanceDays: {
      type: Number,
      required: false,
      default: 7,
      min: 0
    },
    popupTheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PopupTheme',
      required: false // false because PopupTheme requires an offer to be saved.
    },
    offeredProducts: [offerProductSchema],
    offeredCollections: [offerCollectionSchema],
    minimumProductsQuantity: { type: Int32, required: true },
    discountType: {
      type: String,
      required: true,
      enum: ['PERCENTAGE', 'USD', 'SET_PRICE', 'NO_DISCOUNT']
    },
    discountAmount: { type: Number, required: false },
    triggerEvent: {
      type: String,
      required: true,
      enum: ['ADD', 'EXIT', 'LOAD', 'FOCUS', 'SCROLL', 'LINK']
    },
    triggerExternalLinksOnly: { type: Boolean, required: false, default: true },
    triggerScrollThreshold: {
      type: Number,
      required: false,
      default: 75,
      min: 1,
      max: 100
    },
    triggerPage: {
      type: String,
      required: true,
      default: 'ANY',
      enum: ['ANY', 'PAGE']
    },
    triggerPagePath: { type: String, required: false },
    triggerProducts: [offerProductSchema],
    triggerCollections: [offerCollectionSchema],
    enableGeotargeting: { type: Boolean, required: true, default: false },
    geotargetingCountries: [{ type: String, required: true }],
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: false },
    delaySeconds: { type: Number, required: false, default: 0 },
    onPageRequiredSeconds: { type: Number, required: false, default: 0 },
    allowWithDiscountCodes: { type: Boolean, required: true, default: true },
    hideIfItemAdded: { type: Boolean, required: true, default: false },
    showNotificationBanner: { type: Boolean, required: true, default: true },
    enableQuantitySelection: { type: Boolean, required: true, default: false },
    limitQuantitySelection: { type: Boolean, required: true, default: false },
    productQuantityLimit: { type: Int32, required: false },
    enableProductLinks: { type: Boolean, required: true, default: true },
    hideOutOfStockProducts: { type: Boolean, required: true, default: true },
    enableEscClose: { type: Boolean, required: false, default: false },
    enableMaskClose: { type: Boolean, required: false, default: false },
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

schema.statics.findOneRandom = function (shop, params) {
  return findOneRandom(shop, params);
};

schema.methods.findRandomProducts = function () {
  return findRandomProducts(this);
};

schema.methods.calculateDiscountedPrice = function (price) {
  return calculateDiscountedPrice(this, price);
};

schema.methods.findImpressions = async function (startAt, endAt) {
  const OfferHit = mongodbClient.connection.model('OfferHit');

  return OfferHit.findImpressionsByOfferId(this._id, startAt, endAt);
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

schema.methods.findPopupThemes = async function () {
  const PopupTheme = mongodbClient.connection.model('PopupTheme');

  return PopupTheme.findByOfferId(this._id);
};

schema.methods.trackImpression = function (params) {
  return trackImpression(this, params);
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
