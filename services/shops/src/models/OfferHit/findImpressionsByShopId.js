const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const mongodbClient = require('../mongodbClient');

const findImpressionsByShopId = async (shopId, startAt, endAt) => {
  if (typeof shopId !== 'object') {
    shopId = mongoose.Types.ObjectId(shopId);
  }

  const OfferHit = mongodbClient.connection.model('OfferHit');
  const pipelines = [
    {
      $match: {
        shop: shopId,
        createdAt: {
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

  return results;
};

module.exports = findImpressionsByShopId;
