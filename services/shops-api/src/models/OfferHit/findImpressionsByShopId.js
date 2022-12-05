const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const models = require('..');
const fillResults = require('./fillResults');

const findImpressionsByShopId = async (shopId, startAt, endAt) => {
  if (typeof shopId !== 'object') {
    shopId = mongoose.Types.ObjectId(shopId);
  }

  const OfferHit = await models.get('OfferHit');
  const pipelines = [
    {
      $match: {
        shop: shopId,
        createdAt: {
          $gte: new Date(startAt),
          $lte: new Date(endAt)
        },
        isTest: false
      }
    },
    {
      $project: {
        date: {
          $dateToString: {
            format: '%Y-%m-%dT12:00:00Z',
            date: '$createdAt'
          }
        }
      }
    },
    {
      $group: {
        _id: { date: '$date' },
        impressions: { $sum: 1 }
      }
    },
    {
      $project: {
        date: '$_id.date',
        impressions: '$impressions'
      }
    }
  ];
  let results = [];

  results = await OfferHit.aggregate(pipelines);
  results =
    results.map(({ date, impressions }) => ({ date, impressions })) || [];
  results = sortBy(results, ({ date }) => new Date(date));
  results = fillResults(results, 'impressions');

  return results;
};

module.exports = findImpressionsByShopId;
