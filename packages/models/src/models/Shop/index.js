const mongoose = require('mongoose');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;

const mongodbClient = mongodbClientFactory.get(process.env.MONGODB_URI);

const getShopifyApiClient = require('./getShopifyApiClient');
const createOrUpdate = require('./createOrUpdate');
const validateAccessToken = require('./validateAccessToken');
const removeAccessToken = require('./removeAccessToken');
const deactivate = require('./deactivate');
const activateOrDeactivate = require('./activateOrDeactivate');
const grandfather = require('./grandfather');
const initiatePlanUpgrade = require('./initiatePlanUpgrade');
const activatePlanUpgrade = require('./activatePlanUpgrade');
const cancelPlan = require('./cancelPlan');
const downgradePlan = require('./downgradePlan');
const updatePlan = require('./updatePlan');
const initialize = require('./initialize');
const hooks = require('./hooks');

let Shop = null;

const schema = new mongoose.Schema(
  {
    shopifyShopId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true },
    realDomain: { type: String, required: false, trim: true },
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
    timezone: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
    internal: { type: Boolean, required: false, default: false },
    plan: {
      level: {
        type: String,
        required: true,
        enum: ['FREE', 'PREMIUM'],
        default: 'FREE'
      },
      active: { type: Boolean, required: false, default: false },
      chargeId: { type: String, required: false },
      billingOn: { type: Date, required: false },
      upgradedAt: { type: Date, required: false },
      canceledAt: { type: Date, required: false },
      grandfatheredAt: { type: Date, required: false }
    },
    uninstalledAt: { type: Date, required: false }
  },
  { timestamps: true }
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

schema.statics.findByDomain = function (domain) {
  return Shop.findOne({ domain });
};

schema.statics.findByShopifyShopId = function (shopifyShopId) {
  return Shop.findOne({ shopifyShopId });
};

schema.statics.findByDomain = function (domain) {
  return Shop.findOne({ domain });
};

schema.statics.createOrUpdate = function (shopDomain, accessToken) {
  return createOrUpdate(shopDomain, accessToken);
};

schema.methods.deactivate = function () {
  return deactivate(this);
};

schema.methods.getShopifyApiClient = function () {
  return getShopifyApiClient(this);
};

schema.methods.validateAccessToken = function () {
  return validateAccessToken(this);
};

schema.methods.removeAccessToken = function () {
  return removeAccessToken(this);
};

schema.methods.deactivate = function () {
  return deactivate(this);
};

schema.methods.activateOrDeactivate = function () {
  return activateOrDeactivate(this);
};

schema.methods.grandfather = function () {
  return grandfather(this);
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
  const data = [];

  data.push(`ID = ${this.id}`);
  data.push(`Shopify Shop ID = ${this.shopifyShopId}`);
  data.push(`Name = ${this.name}`);
  data.push(`Domain = ${this.domain}`);

  return data.join(' | ');
};

schema.pre('validate', function (next) {
  hooks.preValidate(this, next);
});

// Create indexes.
schema.index({ shopifyShopId: 1 }, { unique: true });
schema.index({ domain: 1 }, { unique: true });
schema.index({ 'plan.upgradedAt': 1 });
schema.index({ createdAt: -1 });

Shop = mongodbClient.connection.model('Shop', schema);

module.exports = Shop;
