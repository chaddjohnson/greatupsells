const mongoose = require('mongoose');
const mongodbClient = require('../mongodbClient');

const preValidate = async (product, next) => {
  const Shop = mongodbClient.connection.model('Shop');

  product.title = product.shopifyProductData.title;

  if (typeof product.shop === 'string') {
    product.shop = mongoose.Types.ObjectId(product.shop);
  }

  // Set up reference to shop if missing.
  if (product.shopifyShopId && !product.shop) {
    try {
      product.shop = await Shop.findOneByShopifyShopId(product.shopifyShopId);
    } catch (error) {
      return next(error);
    }
  }

  next();
};

module.exports.preValidate = preValidate;
