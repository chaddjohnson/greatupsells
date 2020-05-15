const mongoose = require('mongoose');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;

const mongodbClient = mongodbClientFactory.get(process.env.MONGODB_URI);

const deactivate = require('./deactivate');
const hooks = require('./hooks');

let Shop = null;

const schema = new mongoose.Schema({
  platformShopId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  domain: { type: String, required: true, trim: true },
  realDomain: { type: String, required: false, trim: true },
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
  internal: { type: Boolean, required: true, default: false },
  uninstalledAt: { type: Date, required: false }
});

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

schema.statics.findByPlatformShopId = function (platformShopId) {
  return Shop.findOne({ platformShopId });
};

schema.statics.findByDomain = function (domain) {
  return Shop.findOne({ domain });
};

schema.methods.activateOrDeactivate = function () {
  throw new Error('activateOrDeactivate() is not implemented');
};

schema.methods.deactivate = function () {
  return deactivate(this);
};

schema.methods.initialize = function () {
  throw new Error('initialize() is not implemented');
};

schema.methods.toString = function () {
  const data = [];

  data.push(`ID = ${this.id}`);
  data.push(`Platform Shop ID = ${this.platformShopId}`);
  data.push(`Name = ${this.name}`);
  data.push(`Domain = ${this.domain}`);

  return data.join(' | ');
};

schema.pre('validate', function (next) {
  hooks.preValidate(this, next);
});

// Create indexes.
schema.index({ platformShopId: 1 }, { unique: true });
schema.index({ domain: 1 }, { unique: true });
schema.index({ createdAt: -1 });

Shop = mongodbClient.connection.model('Shop', schema);

module.exports = Shop;
