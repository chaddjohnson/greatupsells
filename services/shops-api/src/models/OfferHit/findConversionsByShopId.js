const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const models = require('..');
const fillResults = require('./fillResults');

const findConversionsByShopId = async (shopId, startAt, endAt) => {
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
        },
        isTest: false
      }
    },
    {
      $project: {
        date: {
          $dateToString: {
            format: '%Y-%m-%dT12:00:00Z',
            date: '$convertedAt'
          }
        }
      }
    },
    {
      $group: {
        _id: { date: '$date' },
        conversions: { $sum: 1 }
      }
    },
    {
      $project: {
        date: '$_id.date',
        conversions: '$conversions'
      }
    }
  ];
  let results = [];

  results = await OfferHit.aggregate(pipelines);
  results =
    results.map(({ date, conversions }) => ({ date, conversions })) || [];
  results = sortBy(results, ({ date }) => new Date(date));
  results = fillResults(results, 'conversions');

  return results;
};

module.exports = findConversionsByShopId;
