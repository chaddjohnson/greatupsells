const mongoose = require('mongoose');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;

const mongodbClient = mongodbClientFactory.get(process.env.MONGODB_URI);

let OfferView = null;

const schema = new mongoose.Schema({
  shopifyShopId: { type: Number, required: true },
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true
  }
});

OfferView = mongodbClient.connection.model('OfferView', schema);

module.exports = OfferView;
