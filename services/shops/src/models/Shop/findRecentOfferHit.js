const moment = require('moment-timezone');
const mongodbClient = require('../mongodbClient');

const findRecentOfferHit = async (shop, ipAddress) => {
  const OfferHit = mongodbClient.connection.model('OfferHit');

  return await OfferHit.find({
    shop: shop._id,
    ipAddress,
    updatedAt: { $gte: moment().utc().subtract(1, 'day').toDate() }
  });
};

module.exports = findRecentOfferHit;
