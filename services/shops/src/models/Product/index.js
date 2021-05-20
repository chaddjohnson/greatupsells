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
    shopifyProductData: { type: mongoose.Schema.Types.Mixed, required: true },
    shopifyCollectionIds: [{ type: Number, required: true }],
    title: { type: String, required: true },
    originalShopifyProductId: { type: Number, required: false }
  },
  schemaOptions
);

schema.statics.findByShopId = function (shopId) {
  return Product.find({ shop: mongoose.Types.ObjectId(shopId) });
};

schema.statics.findOneByShopifyProductId = function (shopifyProductId) {
  return Product.findOne({ shopifyProductId });
};

schema.methods.copy = function (
  shopifyProductDataOverrides,
  variant,
  quantity
) {
  return copy(this, shopifyProductDataOverrides, variant, quantity);
};

schema.statics.removeCopiedProducts = function () {
  return removeCopiedProducts();
};

schema.methods.trackShopifyCollections = function () {
  return trackShopifyCollections(this);
};

schema.methods.toString = function () {
  return toString(this);
};

schema.pre('validate', function (next) {
  hooks.preValidate(this, next);
});

schema.index({ shopifyShopId: 1 });
schema.index({ shopifyProductId: 1 }, { unique: true });
schema.index({ shop: 1, shopifyProductId: 1, shopifyCollectionIds: 1 });

Product = mongodbClient.connection.model('Product', schema);

module.exports = Product;
