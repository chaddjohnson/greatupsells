const mongoose = require('mongoose');
const mongodbClient = require('../mongodbClient');
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
    title: { type: String, required: true }
  },
  schemaOptions
);

schema.statics.findOneByShopifyProductId = function (shopifyProductId) {
  return Product.findOne({ shopifyProductId: parseInt(shopifyProductId) });
};

schema.statics.findOneByShopifyVariantId = function (shopifyVariantId) {
  return Product.findOne({
    'shopifyProductData.variants.id': shopifyVariantId
  });
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
schema.index({ 'shopifyProductData.variants.id': 1 });

Product = mongodbClient.connection.model('Product', schema);

module.exports = Product;
