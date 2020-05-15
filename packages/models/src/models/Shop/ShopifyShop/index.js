const mongoose = require('mongoose');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;
const Shop = require('..');
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

const mongodbClient = mongodbClientFactory.get(process.env.MONGODB_URI);
let ShopifyShop = null;

const schema = mongoose.Schema({
  accessToken: { type: String, required: false },
  plan: {
    level: {
      type: String,
      required: true,
      enum: ['FREE', 'PREMIUM'],
      default: 'FREE'
    },
    active: { type: Boolean, required: true, default: false },
    chargeId: { type: String, required: false },
    billingOn: { type: Date, required: false },
    upgradedAt: { type: Date, required: false },
    canceledAt: { type: Date, required: false },
    grandfatheredAt: { type: Date, required: false }
  }
});

schema.virtual('Product').get(function () {
  return mongodbClient.connection.model('ShopifyProduct');
});

schema.statics.createOrUpdate = function (shopDomain, accessToken) {
  return createOrUpdate(shopDomain, accessToken);
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

schema.index({ 'plan.upgradedAt': 1 });

ShopifyShop = Shop.discriminator('ShopifyShop', schema);

module.exports = ShopifyShop;
