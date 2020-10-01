const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;
const trackConversions = require('./trackConversions');

require('mongoose-long')(mongoose);

const mongodbClient = mongodbClientFactory.get(process.env.MONGODB_URI);

let Order = null;

const schemaOptions = {
  timestamps: true
};
const schema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopifyShopId: { type: mongoose.Schema.Types.Long, required: true },
    shopifyOrderId: { type: mongoose.Schema.Types.Long, required: true },
    shopifyOrderNumber: { type: Int32, required: true },
    shopifyOrderData: { type: mongoose.Schema.Types.Mixed, required: true },
    revenueIncrease: { type: Number, required: false, min: 0 }
  },
  schemaOptions
);

schema.methods.trackConversions = function () {
  return trackConversions(this);
};

schema.index({ shopifyShopId: 1, shopifyOrderNumber: 1 }, { unique: true });
schema.index({ shopifyOrderId: 1 }, { unique: true });

Order = mongodbClient.connection.model('Order', schema);

module.exports = Order;
