const logger = require('@neatowebsolutions/logger');
const models = require('..');

const preValidate = async (offer, next) => {
  const Shop = await models.get('Shop');

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

const postSave = async (offer, next) => {
  await offer.execPopulate('shop');

  logger.info(
    `Offer ${
      offer.$locals.wasNew ? 'created' : 'updated'
    } (${offer.toString()})`,
    offer.toObject()
  );

  next();
};

const postRemove = async (offer, next) => {
  await offer.execPopulate('shop');

  logger.info(`Offer deleted (${offer.toString()})`);

  next();
};

module.exports = {
  preValidate,
  postSave,
  postRemove
};
