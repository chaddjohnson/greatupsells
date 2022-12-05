const mongoose = require('mongoose');
const mongodbClient = require('../mongodbClient');
const findPairedProducts = require('./findPairedProducts');
const findOnePairedProduct = require('./findOnePairedProduct');
const findOneTopProduct = require('./findOneTopProduct');

let PairedPurchase = null;

const schemaOptions = {
  timestamps: true,
  collection: 'pairedPurchases'
};
const schema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopifyShopId: { type: Number, required: true },
    shopifyProductId: { type: Number, required: true },
    pairedShopifyProductId: { type: Number, required: true },
    pairedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    pairedProductHasInventory: { type: Boolean, required: true },
    pairedProductIsPublished: { type: Boolean, required: true },
    frequency: { type: Number, required: true, default: 0 }
  },
  schemaOptions
);

schema.statics.findPairedProducts = function (
  shop,
  shopifyProductIds,
  quantity,
  excludedShopifyProductIds
) {
  return findPairedProducts(
    shop,
    shopifyProductIds,
    quantity,
    excludedShopifyProductIds
  );
};

schema.statics.findOnePairedProduct = function (shopifyProductId, options) {
  return findOnePairedProduct(shopifyProductId, options);
};

schema.statics.findOneTopProduct = function (shop, options) {
  return findOneTopProduct(shop, options);
};

schema.index({ shop: 1 });
schema.index(
  { shopifyProductId: 1, pairedShopifyProductId: 1 },
  { unique: true }
);

PairedPurchase = mongodbClient.connection.model('PairedPurchase', schema);

module.exports = PairedPurchase;
