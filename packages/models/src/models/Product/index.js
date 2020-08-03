const mongoose = require('mongoose');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;

const mongodbClient = mongodbClientFactory.get(process.env.MONGODB_URI);

const findByShopId = require('./findByShopId');
const copy = require('./copy');
const removeCopiedProducts = require('./removeCopiedProducts');
const preValidateHook = require('./preValidateHook');

let Product = null;

const schema = new mongoose.Schema(
  {
    shopifyShopId: { type: String, required: true },
    shopifyProductId: { type: String, required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    title: { type: String, required: true },
    shopifyProductData: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

schema.statics.findByShopId = function (shopId) {
  return findByShopId(shopId);
};

schema.statics.removeCopiedProducts = function () {
  return removeCopiedProducts(this);
};

schema.methods.copy = function () {
  return copy(this);
};

schema.methods.toString = function () {
  const data = [];

  data.push(`ID = ${this.id}`);
  data.push(`Shopify Shop ID = ${this.shopifyShopId}`);
  data.push(`Shopify Product ID = ${this.shopifyProductId}`);

  if (this.shop) {
    data.push(`Shop = ${this.shop.domain}`);
  }

  return data.join(' | ');
};

schema.pre('validate', function (next) {
  preValidateHook(this, next);
});

schema.index({ shopifyShopId: 1 });
schema.index({ shopifyProductId: 1 });

Product = mongodbClient.connection.model('Product', schema);

module.exports = Product;
