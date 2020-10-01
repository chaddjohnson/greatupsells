const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;

require('mongoose-long')(mongoose);

const mongodbClient = mongodbClientFactory.get(process.env.MONGODB_URI);

let Collection = null;

const schemaOptions = {
  timestamps: true
};
const schema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopifyShopId: { type: mongoose.Schema.Types.Long, required: true },
    shopifyCollectionId: { type: mongoose.Schema.Types.Long, required: true },
    productCount: { type: Int32, required: true }
  },
  schemaOptions
);

schema.index({ shopifyShopId: 1 });
schema.index({ shopifyCollectionId: 1 }, { unique: true });

Collection = mongodbClient.connection.model('Collection', schema);

module.exports = Collection;
