const mongoose = require('mongoose');
const models = require('..');

const preValidate = async (offer, next) => {
  const Shop = await models.get('Shop');

  // Ensure ObjectId fields are indeed type ObjectId.
  if (typeof offer.shop === 'string') {
    offer.shop = mongoose.Types.ObjectId(offer.shop);
  }
  if (typeof offer.theme === 'string') {
    offer.theme = mongoose.Types.ObjectId(offer.theme);
  }

  if (offer.shop) {
    await offer.execPopulate('shop');
  }

  // Set up reference to the shop if missing.
  if (offer.shopifyShopId && !offer.shop) {
    try {
      offer.shop = await Shop.findOneByShopifyShopId(offer.shopifyShopId);
    } catch (error) {
      return next(error);
    }
  }

  if (offer.triggerPagePath && offer.triggerPagePath !== '/') {
    // Sanitize `triggerPagePath`. This removes trailing slash and query strings.
    offer.triggerPagePath = offer.triggerPagePath.replace(/(\/*$|\/*?\?.*)/g, '');
  }

  if (offer.strategy === 'POST_PURCHASE') {
    offer.viewAllowance = 'PAGE';
    offer.viewAllowanceDays = undefined;
  }

  if (!offer.shop.onlineStore2Theme && offer.strategy === 'POST_PURCHASE') {
    return next(new Error('A Shopify 2.0 theme is required to use post-checkout features.'));
  }

  next();
};

module.exports.preValidate = preValidate;
