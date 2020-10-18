const mongoose = require('mongoose');
const mongodbClient = require('../mongodbClient');
const copy = require('./copy');
const removeCopiedProducts = require('./removeCopiedProducts');
const preValidateHook = require('./preValidateHook');
const toString = require('./toString');

require('mongoose-long')(mongoose);

let Product = null;

const schemaOptions = {
  timestamps: true
};
const schema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopifyShopId: { type: mongoose.Schema.Types.Long, required: true },
    shopifyProductId: { type: mongoose.Schema.Types.Long, required: true },
    shopifyProductData: { type: mongoose.Schema.Types.Mixed, required: true },
    originalShopifyProductId: {
      type: mongoose.Schema.Types.Long,
      required: false
    }
  },
  schemaOptions
);

schema.statics.findByShopId = function (shopId) {
  return Product.find({ shop: shopId });
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

schema.methods.toString = function () {
  return toString(this);
};

schema.pre('validate', function (next) {
  preValidateHook(this, next);
});

schema.index({ shopifyShopId: 1 });
schema.index({ shopifyProductId: 1 }, { unique: true });

Product = mongodbClient.connection.model('Product', schema);

module.exports = Product;
