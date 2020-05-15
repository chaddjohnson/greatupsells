const mongoose = require('mongoose');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;

const mongodbClient = mongodbClientFactory.get(process.env.MONGODB_URI);

const findByShopId = require('./findByShopId');

let Product = null;

const schema = new mongoose.Schema({
  platformShopId: { type: String, required: true },
  platformProductId: { type: String, required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  title: { type: String, required: true }
});

schema.statics.findByShopId = function (shopId) {
  return findByShopId(shopId);
};

schema.statics.removeCopiedProducts = function () {
  throw new Error('removeCopiedProducts() is not implemented');
};

schema.methods.copy = function () {
  throw new Error('copy() is not implemented');
};

schema.methods.toString = function () {
  const data = [];

  data.push(`ID = ${this.id}`);
  data.push(`Platform Shop ID = ${this.platformShopId}`);
  data.push(`Platform Product ID = ${this.platformProductId}`);

  if (this.shop) {
    data.push(`Shop = ${this.shop.domain}`);
  }

  return data.join(' | ');
};

schema.index({ platformShopId: 1 });
schema.index({ platformProductId: 1 });

Product = mongodbClient.connection.model('Product', schema);

module.exports = Product;
