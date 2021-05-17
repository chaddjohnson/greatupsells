const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const mongodbClient = require('../mongodbClient');

const findRevenueIncreasesByShopId = async (shopId, startAt, endAt) => {
  if (typeof shopId !== 'object') {
    shopId = mongoose.Types.ObjectId(shopId);
  }

  const OfferHit = mongodbClient.connection.model('OfferHit');
  const pipelines = [
    {
      $match: {
        shop: shopId,
        convertedAt: {
          $gte: new Date(startAt),
          $lte: new Date(endAt)
        }
      }
    },
    {
      $project: {
        date: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$convertedAt'
          }
        },
        revenueIncrease: '$revenueIncrease'
      }
    },
    {
      $group: {
        _id: { date: '$date' },
        revenueIncrease: { $sum: '$revenueIncrease' }
      }
    },
    {
      $project: {
        date: '$_id.date',
        revenueIncrease: '$revenueIncrease'
      }
    }
  ];
  let results = [];

  results = await OfferHit.aggregate(pipelines);
  results =
    results.map(({ date, revenueIncrease }) => ({ date, revenueIncrease })) ||
    [];
  results = sortBy(results, ({ date }) => new Date(date));

  return results;
};

module.exports = findRevenueIncreasesByShopId;
