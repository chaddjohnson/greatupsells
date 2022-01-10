const models = require('..');

const searchOffers = async (shop, { query, status }) => {
  const Offer = await models.get('Offer');
  const shopId = shop._id;
  const offers = await Offer.search({ shopId, query, status });

  return offers;
};

module.exports = searchOffers;
