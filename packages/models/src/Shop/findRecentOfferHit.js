const moment = require('moment-timezone');

const findRecentOfferHit = async (shop, ipAddress) => {
  const models = require('..');
  const OfferHit = await models.get('OfferHit');
  const { shopifyShopId } = shop;

  return OfferHit.find({
    shopifyShopId,
    ipAddress,
    updatedAt: { $gte: moment().utc().subtract(1, 'day').toDate() }
  });
};

module.exports = findRecentOfferHit;
