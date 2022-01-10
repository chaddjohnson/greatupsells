const models = require('..');

const search = async ({ shopId, query, status }) => {
  const Offer = await models.get('Offer');
  const criteria = {};
  let offers = [];
  const escapedQuery = query?.replace(/[-\+\/\\^$*+?.()|[\]{}]/g, '\\$&');

  if (shopId) {
    criteria.shop = shopId;
  }

  if (query) {
    criteria.name = { $regex: new RegExp(escapedQuery), $options: 'i' };
  }

  // Active
  if (status?.toLowerCase() === 'active') {
    criteria.enabled = true;
    criteria.startAt = { $lte: new Date() };
    criteria.$or = [
      {
        endAt: null
      },
      {
        endAt: { $gte: new Date() }
      }
    ];
  }

  // Pending
  if (status?.toLowerCase() === 'pending') {
    criteria.enabled = true;
    criteria.startAt = { $gte: new Date() };
  }

  // Expired
  if (status?.toLowerCase() === 'expired') {
    criteria.enabled = true;
    criteria.endAt = { $lte: new Date() };
  }

  // Disabled
  if (status?.toLowerCase() === 'disabled') {
    criteria.enabled = false;
  }

  offers = await Offer.find(criteria);

  return offers;
};

module.exports = search;
