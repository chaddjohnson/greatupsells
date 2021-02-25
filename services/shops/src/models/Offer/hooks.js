const mongoose = require('mongoose');
const mongodbClient = require('../mongodbClient');

const preValidate = async (offer, next) => {
  const Shop = mongodbClient.connection.model('Shop');

  // Ensure ObjectId fields are indeed type ObjectId.
  if (typeof offer.shop === 'string') {
    offer.shop = mongoose.Types.ObjectId(offer.shop);
  }
  if (typeof offer.popupTheme === 'string') {
    offer.popupTheme = mongoose.Types.ObjectId(offer.popupTheme);
  }

  // Set up reference to shop if missing.
  if (offer.shopifyShopId && !offer.shop) {
    try {
      offer.shop = await Shop.findByShopifyShopId(offer.shopifyShopId);
    } catch (error) {
      return next(error);
    }
  }

  next();
};

module.exports.preValidate = preValidate;
