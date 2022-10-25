const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');
const getShopifyApiClient = require('./getShopifyApiClient');
const createOrUpdate = require('./createOrUpdate');
const createWebhooks = require('./createWebhooks');
const importCollections = require('./importCollections');
const importProducts = require('./importProducts');
const getIsPostPurchaseAppInUse = require('./getIsPostPurchaseAppInUse');
const deactivate = require('./deactivate');
const updateActiveStatus = require('./updateActiveStatus');
const activatePlan = require('./activatePlan');
const cancelPlan = require('./cancelPlan');
const resetPlan = require('./resetPlan');
const changePlan = require('./changePlan');
const updatePlan = require('./updatePlan');
const searchOffers = require('./searchOffers');
const initialize = require('./initialize');
const createDraftOrder = require('./createDraftOrder');
const addDraftOrderLineItems = require('./addDraftOrderLineItems');
const updateShopifyDraftOrderItems = require('./updateShopifyDraftOrderItems');
const checkThemeCompatibility = require('./checkThemeCompatibility');
const installAppEmbedBlock = require('./installAppEmbedBlock');
const getAppEmbedBlockIsInstalledAndEnabled = require('./getAppEmbedBlockIsInstalledAndEnabled');
const calculateMonthUpsellRevenue = require('./calculateMonthUpsellRevenue');
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
      name: { type: String, required: false },
      level: {
        type: String,
        enum: ['BASIC', 'PLUS', 'PRO']
      },
      price: { type: Number, required: false, min: 0 },
      active: { type: Boolean, required: false, default: false },
      chargeId: { type: String, required: false },
      billingOn: { type: Date, required: false },
      startedAt: { type: Date, required: false },
      canceledAt: { type: Date, required: false },
      monthUpsellRevenue: { type: Number, required: false },
      monthUpsellRevenueLimit: { type: Number }
    },
    appLastOpenedAt: { type: Date, required: false },
    uninstalledAt: { type: Date, required: false },
    offerImpressionCount: { type: Int32, required: true, default: 0, min: 0 },
    offerAcceptanceCount: { type: Int32, required: true, default: 0, min: 0 },
    offerConversionCount: { type: Int32, required: true, default: 0, min: 0 },
    offerConversionRate: { type: Number, required: true, default: 0.0, min: 0 },
    revenueIncrease: { type: Number, required: true, default: 0.0 },
    onlineStore2Theme: { type: Boolean, required: true, default: false }
  },
  schemaOptions
);

schema.virtual('shopName').get(function () {
  return this.domain.replace(/^([^\.]+).*$/, '$1');
});

schema.statics.findOneByDomain = function (domain) {
  return Shop.findOne({
    $or: [{ domain }, { alternateDomain: domain }]
  });
};

schema.statics.findOneByShopifyShopId = function (shopifyShopId) {
  return Shop.findOne({ shopifyShopId: parseInt(shopifyShopId) });
};

schema.statics.createOrUpdate = function (shopDomain, accessToken) {
  return createOrUpdate(shopDomain, accessToken);
};

schema.methods.searchOffers = async function (params) {
  return searchOffers(this, params);
};

schema.methods.findImpressions = async function (startAt, endAt) {
  const models = require('..');
  const OfferHit = await models.get('OfferHit');

  return OfferHit.findImpressionsByShopId(this._id, startAt, endAt);
};

schema.methods.findAcceptances = async function (startAt, endAt) {
  const models = require('..');
  const OfferHit = await models.get('OfferHit');

  return OfferHit.findAcceptancesByShopId(this._id, startAt, endAt);
};

schema.methods.findRevenueIncreases = async function (startAt, endAt) {
  const models = require('..');
  const OfferHit = await models.get('OfferHit');

  return OfferHit.findRevenueIncreasesByShopId(this._id, startAt, endAt);
};

schema.methods.findConversions = async function (startAt, endAt) {
  const models = require('..');
  const OfferHit = await models.get('OfferHit');

  return OfferHit.findConversionsByShopId(this._id, startAt, endAt);
};

schema.methods.findConversionRates = async function (startAt, endAt) {
  const models = require('..');
  const OfferHit = await models.get('OfferHit');

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

schema.methods.getIsPostPurchaseAppInUse = function () {
  return getIsPostPurchaseAppInUse(this);
};

schema.methods.deactivate = function () {
  return deactivate(this);
};

schema.methods.updateActiveStatus = function () {
  return updateActiveStatus(this);
};

schema.methods.activatePlan = function () {
  return activatePlan(this);
};

schema.methods.cancelPlan = function () {
  return cancelPlan(this);
};

schema.methods.resetPlan = function () {
  return resetPlan(this);
};

schema.methods.changePlan = function (level) {
  return changePlan(this, level);
};

schema.methods.updatePlan = function () {
  return updatePlan(this);
};

schema.methods.initialize = function () {
  return initialize(this);
};

schema.methods.createDraftOrder = function (data) {
  return createDraftOrder(this, data);
};

schema.methods.addDraftOrderLineItems = function (draftOrderId, items) {
  return addDraftOrderLineItems(this, draftOrderId, items);
};

schema.methods.updateShopifyDraftOrderItems = function (
  draftOrderId,
  shopifyCartItems
) {
  return updateShopifyDraftOrderItems(this, draftOrderId, shopifyCartItems);
};

schema.methods.checkThemeCompatibility = function () {
  return checkThemeCompatibility(this);
};

schema.methods.installAppEmbedBlock = function (shopifyThemeId) {
  return installAppEmbedBlock(this, shopifyThemeId);
};

schema.methods.getAppEmbedBlockIsInstalledAndEnabled = function () {
  return getAppEmbedBlockIsInstalledAndEnabled(this);
};

schema.methods.calculateMonthUpsellRevenue = function () {
  return calculateMonthUpsellRevenue(this);
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
