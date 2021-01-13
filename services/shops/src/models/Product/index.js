const mongoose = require('mongoose');
const mongodbClient = require('../mongodbClient');
const copy = require('./copy');
const removeCopiedProducts = require('./removeCopiedProducts');
const trackShopifyCollections = require('./trackShopifyCollections');
const toString = require('./toString');
const hooks = require('./hooks');

let Product = null;

const schemaOptions = {
  timestamps: true
};
const schema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopifyShopId: { type: Number, required: true },
    shopifyProductId: { type: Number, required: true },
    shopifyCollectionIds: [{ type: Number, required: true }],
    shopifyProductData: { type: mongoose.Schema.Types.Mixed, required: true },
    originalShopifyProductId: { type: Number, required: false },
    title: { type: String, required: true }
  },
  schemaOptions
);

schema.statics.findByShopId = function (shopId) {
  return Product.find({ shop: mongoose.Types.ObjectId(shopId) });
};

schema.statics.findByShopifyProductId = function (shopifyProductId) {
  return Product.findOne({ shopifyProductId });
};

schema.methods.copy = function (shopifyProductDataOverrides) {
  return copy(this, shopifyProductDataOverrides);
};

schema.statics.removeCopiedProducts = function () {
  return removeCopiedProducts(this);
};

schema.methods.trackShopifyCollections = function () {
  return trackShopifyCollections(this);
};

schema.methods.toString = function () {
  return toString(this);
};

schema.pre('validate', function (next) {
  hooks.prevalidate(this, next);
});

schema.index({ shopifyShopId: 1 });
schema.index({ shopifyProductId: 1 }, { unique: true });

Product = mongodbClient.connection.model('Product', schema);

module.exports = Product;
