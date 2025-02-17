const mongoose = require('mongoose');
const models = require('..');

const preValidate = async (collection, next) => {
  const Shop = await models.get('Shop');

  collection.title = collection.shopifyCollectionData.title;

  if (typeof collection.shop === 'string') {
    collection.shop = mongoose.Types.ObjectId(collection.shop);
  }

  // Set up reference to shop if missing.
  if (collection.shopifyShopId && !collection.shop) {
    try {
      collection.shop = await Shop.findOneByShopifyShopId(collection.shopifyShopId);
    } catch (error) {
      return next(error);
    }
  }

  next();
};

module.exports.preValidate = preValidate;
