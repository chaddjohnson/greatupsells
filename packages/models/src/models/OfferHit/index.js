const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;
const findViewsByOfferId = require('./findViewsByOfferId');
const findAcceptancesByOfferId = require('./findAcceptancesByOfferId');
const findRevenueIncreasesByOfferId = require('./findRevenueIncreasesByOfferId');
const findConversionsByOfferId = require('./findConversionsByOfferId');
const findConversionRatesByOfferId = require('./findConversionRatesByOfferId');

require('mongoose-long')(mongoose);

const mongodbClient = mongodbClientFactory.get(process.env.MONGODB_URI);

let OfferHit = null;

const schemaOptions = {
  timestamps: true,
  collection: 'offerHits'
};
const schema = new mongoose.Schema(
  {
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      required: true
    },
    shopifyShopId: { type: mongoose.Schema.Types.Long, required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopifyProductId: { type: mongoose.Schema.Types.Long, required: true },
    shopifyOrderId: { type: mongoose.Schema.Types.Long, required: false },
    shopifyOrderNumber: { type: Int32, required: false },
    ipAddress: { type: String, required: false },
    acceptedAt: { type: Date, required: false },
    convertedAt: { type: Date, required: false },
    revenueIncrease: { type: Number, required: true, default: 0.0 }
  },
  schemaOptions
);

schema.statics.findByShopifyShopId = function (shopifyShopId) {
  return OfferHit.find({ shopifyShopId });
};

schema.statics.findByOfferId = function (offerId) {
  return OfferHit.find({ offer: offerId });
};

schema.statics.findViewsByOfferId = function (offerId, startAt, endAt) {
  return findViewsByOfferId(offerId, startAt, endAt);
};

schema.statics.findAcceptancesByOfferId = function (offerId, startAt, endAt) {
  return findAcceptancesByOfferId(offerId, startAt, endAt);
};

schema.statics.findRevenueIncreasesByOfferId = function (
  offerId,
  startAt,
  endAt
) {
  return findRevenueIncreasesByOfferId(offerId, startAt, endAt);
};

schema.statics.findConversionsByOfferId = function (offerId, startAt, endAt) {
  return findConversionsByOfferId(offerId, startAt, endAt);
};

schema.statics.findConversionRatesByOfferId = function (
  offerId,
  startAt,
  endAt
) {
  return findConversionRatesByOfferId(offerId, startAt, endAt);
};

OfferHit = mongodbClient.connection.model('OfferHit', schema);

module.exports = OfferHit;
