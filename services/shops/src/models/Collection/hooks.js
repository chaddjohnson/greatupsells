const mongoose = require('mongoose');
const mongodbClient = require('../mongodbClient');

const preValidate = async (collection, next) => {
  const Shop = mongodbClient.connection.model('Shop');

  collection.title = collection.shopifyCollectionData.title;

  if (typeof collection.shop === 'string') {
    collection.shop = mongoose.Types.ObjectId(collection.shop);
  }

  // Set up reference to shop if missing.
  if (collection.shopifyShopId && !collection.shop) {
    try {
      collection.shop = await Shop.findByShopifyShopId(
        collection.shopifyShopId
      );
    } catch (error) {
      return next(error);
    }
  }

  next();
};

module.exports.preValidate = preValidate;
