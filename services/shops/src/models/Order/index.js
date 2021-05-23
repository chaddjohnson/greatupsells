const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClient = require('../mongodbClient');
const trackConversions = require('./trackConversions');
const cancel = require('./cancel');
const toString = require('./toString');

let Order = null;

const schemaOptions = {
  timestamps: true
};
const schema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopifyShopId: { type: Number, required: true },
    shopifyOrderId: { type: Number, required: true },
    shopifyOrderNumber: { type: Int32, required: true },
    shopifyOrderData: { type: mongoose.Schema.Types.Mixed, required: true },
    revenueIncrease: { type: Number, required: true, default: 0, min: 0 },
    canceledAt: { type: Date, required: false }
  },
  schemaOptions
);

schema.options.toJSON = {
  transform(document, transformed) {
    transformed.orderNumber = document.orderNumber;
    return transformed;
  }
};

schema.virtual('orderNumber').get(function () {
  return `${this.shopifyShopId}-${this.shopifyOrderNumber}`;
});

schema.statics.findOneByShopifyOrderId = function (shopifyOrderId) {
  return Order.findOne({ shopifyOrderId: parseInt(shopifyOrderId) });
};

schema.methods.trackConversions = function () {
  return trackConversions(this);
};

schema.methods.cancel = function () {
  return cancel(this);
};

schema.methods.toString = function () {
  return toString(this);
};

schema.index({ shopifyShopId: 1, shopifyOrderNumber: 1 }, { unique: true });
schema.index({ shopifyOrderId: 1 }, { unique: true });

Order = mongodbClient.connection.model('Order', schema);

module.exports = Order;
