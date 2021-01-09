const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');
const trackShopifyProducts = require('./trackShopifyProducts');
const toString = require('./toString');

let Collection = null;

const schemaOptions = {
  timestamps: true
};
const schema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopifyShopId: { type: Number, required: true },
    shopifyCollectionId: { type: Number, required: true },
    shopifyProductIds: [{ type: Number, required: true }],
    shopifyCollectionData: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    productCount: { type: Int32, required: true, default: 0, min: 0 }
  },
  schemaOptions
);

schema.statics.findByShopifyCollectionId = function (shopifyCollectionId) {
  return Collection.findOne({ shopifyCollectionId });
};

schema.methods.trackShopifyProducts = function () {
  return trackShopifyProducts(this);
};

schema.methods.toString = function () {
  return toString(this);
};

schema.index({ shopifyShopId: 1 });
schema.index({ shopifyCollectionId: 1 }, { unique: true });

Collection = mongodbClient.connection.model('Collection', schema);

module.exports = Collection;
