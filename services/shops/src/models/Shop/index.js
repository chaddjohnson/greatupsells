const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');
const getShopifyApiClient = require('./getShopifyApiClient');
const createOrUpdate = require('./createOrUpdate');
const findRecentOfferHit = require('./findRecentOfferHit');
const createWebhooks = require('./createWebhooks');
const importCollections = require('./importCollections');
const importProducts = require('./importProducts');
const deactivate = require('./deactivate');
const updateActiveStatus = require('./updateActiveStatus');
const initiatePlanUpgrade = require('./initiatePlanUpgrade');
const activatePlanUpgrade = require('./activatePlanUpgrade');
const cancelPlan = require('./cancelPlan');
const resetPlan = require('./resetPlan');
const downgradePlan = require('./downgradePlan');
const updatePlan = require('./updatePlan');
const updatePlans = require('./updatePlans');
const fixWebhooks = require('./fixWebhooks');
const updateActiveStatuses = require('./updateActiveStatuses');
const initialize = require('./initialize');
const toString = require('./toString');
const hooks = require('./hooks');

let Shop = null;

const schemaOptions = {
  timestamps: true
};
const schema = new mongoose.Schema(
  {
    shopifyShopId: { type: Number, required: true },
    shopifyShopData: { type: mongoose.Schema.Types.Mixed, required: true },
    name: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true },
    alternateDomain: { type: String, required: false, trim: true },
    accessToken: { type: String, required: false },
    contactName: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: false, trim: true },
    countryCode: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 2,
      match: /^[A-Z]+$/
    },
    currency: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 3,
      match: /^[A-Z]+$/
    },
    locale: { type: String, required: true },
    timezone: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
    shopifyPlan: { type: String, required: true },
    plan: {
      level: {
        type: String,
        required: true,
        enum: ['FREE', 'BASIC', 'PLUS', 'PRO'],
        default: 'FREE'
      },
      price: { type: Number, required: false, default: 0.0, min: 0 },
      active: { type: Boolean, required: false, default: false },
      chargeId: { type: String, required: false },
      billingOn: { type: Date, required: false },
      upgradedAt: { type: Date, required: false },
      canceledAt: { type: Date, required: false }
    },
    appLastOpenedAt: { type: Date, required: false },
    uninstalledAt: { type: Date, required: false },
    offerImpressionCount: { type: Int32, required: true, default: 0, min: 0 },
    offerAcceptanceCount: { type: Int32, required: true, default: 0, min: 0 },
    offerConversionCount: { type: Int32, required: true, default: 0, min: 0 },
    offerConversionRate: { type: Number, required: true, default: 0.0, min: 0 },
    revenueIncrease: { type: Number, required: true, default: 0.0, min: 0 }
  },
  schemaOptions
);

schema.options.toJSON = {
  transform(document, transformed) {
    delete transformed.accessToken;
    return transformed;
  }
};

schema.virtual('shopName').get(function () {
  return this.domain.replace(/^([^\.]+).*$/, '$1');
});

schema.statics.findOneByDomain = function (domain) {
  return Shop.findOne({
    $or: [{ domain }, { alternateDomain: domain }]
  });
};

schema.statics.findOneByShopifyShopId = function (shopifyShopId) {
  return Shop.findOne({ shopifyShopId });
};

schema.statics.createOrUpdate = function (shopDomain, accessToken) {
  return createOrUpdate(shopDomain, accessToken);
};

schema.statics.updatePlans = function () {
  return updatePlans();
};

schema.statics.fixWebhooks = function () {
  return fixWebhooks();
};

schema.statics.updateActiveStatuses = function () {
  return updateActiveStatuses();
};

schema.methods.findRecentOfferHit = function (ipAddress) {
  return findRecentOfferHit(this, ipAddress);
};

schema.methods.findImpressions = async function (startAt, endAt) {
  const OfferHit = mongodbClient.connection.model('OfferHit');

  return OfferHit.findImpressionsByShopId(this._id, startAt, endAt);
};

schema.methods.findAcceptances = async function (startAt, endAt) {
  const OfferHit = mongodbClient.connection.model('OfferHit');

  return OfferHit.findAcceptancesByShopId(this._id, startAt, endAt);
};

schema.methods.findRevenueIncreases = async function (startAt, endAt) {
  const OfferHit = mongodbClient.connection.model('OfferHit');

  return OfferHit.findRevenueIncreasesByShopId(this._id, startAt, endAt);
};

schema.methods.findConversions = async function (startAt, endAt) {
  const OfferHit = mongodbClient.connection.model('OfferHit');

  return OfferHit.findConversionsByShopId(this._id, startAt, endAt);
};

schema.methods.findConversionRates = async function (startAt, endAt) {
  const OfferHit = mongodbClient.connection.model('OfferHit');

  return OfferHit.findConversionRatesByShopId(this._id, startAt, endAt);
};

schema.methods.getShopifyApiClient = function () {
  return getShopifyApiClient(this);
};

schema.methods.createWebhooks = function () {
  return createWebhooks(this);
};

schema.methods.importCollections = function () {
  return importCollections(this);
};

schema.methods.importProducts = function () {
  return importProducts(this);
};

schema.methods.deactivate = function () {
  return deactivate(this);
};

schema.methods.updateActiveStatus = function () {
  return updateActiveStatus(this);
};

schema.methods.initiatePlanUpgrade = function () {
  return initiatePlanUpgrade(this);
};

schema.methods.activatePlanUpgrade = function () {
  return activatePlanUpgrade(this);
};

schema.methods.cancelPlan = function () {
  return cancelPlan(this);
};

schema.methods.resetPlan = function () {
  return resetPlan(this);
};

schema.methods.downgradePlan = function () {
  return downgradePlan(this);
};

schema.methods.updatePlan = function () {
  return updatePlan(this);
};

schema.methods.initialize = function () {
  return initialize(this);
};

schema.methods.toString = function () {
  return toString(this);
};

schema.pre('validate', function (next) {
  hooks.preValidate(this, next);
});

// Create indexes.
schema.index({ shopifyShopId: 1 }, { unique: true });
schema.index({ domain: 1 }, { unique: true });
schema.index({ alternateDomain: 1 });
schema.index({ createdAt: -1 });

Shop = mongodbClient.connection.model('Shop', schema);

module.exports = Shop;
