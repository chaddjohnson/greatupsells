const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const models = require('..');
const fillResults = require('./fillResults');

const findRevenueIncreasesByShopId = async (shopId, startAt, endAt) => {
  if (typeof shopId !== 'object') {
    shopId = mongoose.Types.ObjectId(shopId);
  }

  const OfferHit = await models.get('OfferHit');
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
            format: '%Y-%m-%dT12:00:00Z',
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
  results = fillResults(results, 'revenueIncrease');

  return results;
};

module.exports = findRevenueIncreasesByShopId;
