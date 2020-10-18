const moment = require('moment-timezone');
const mongodbClient = require('../mongodbClient');

const findRecentOfferHit = async (shop, ipAddress) => {
  const OfferHit = mongodbClient.connection.model('OfferHit');
  const { shopifyShopId } = shop;

  return OfferHit.find({
    shopifyShopId,
    ipAddress,
    updatedAt: { $gte: moment().utc().subtract(1, 'day').toDate() }
  });
};

module.exports = findRecentOfferHit;
