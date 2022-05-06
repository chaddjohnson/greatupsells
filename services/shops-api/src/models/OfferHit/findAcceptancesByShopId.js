const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const models = require('..');
const fillResults = require('./fillResults');

const findAcceptancesByShopId = async (shopId, startAt, endAt) => {
  if (typeof shopId !== 'object') {
    shopId = mongoose.Types.ObjectId(shopId);
  }

  const OfferHit = await models.get('OfferHit');
  const pipelines = [
    {
      $match: {
        shop: shopId,
        acceptedAt: {
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
            date: '$acceptedAt'
          }
        }
      }
    },
    {
      $group: {
        _id: { date: '$date' },
        acceptances: { $sum: 1 }
      }
    },
    {
      $project: {
        date: '$_id.date',
        acceptances: '$acceptances'
      }
    }
  ];
  let results = [];

  results = await OfferHit.aggregate(pipelines);
  results =
    results.map(({ date, acceptances }) => ({ date, acceptances })) || [];
  results = sortBy(results, ({ date }) => new Date(date));
  results = fillResults(results, 'acceptances');

  return results;
};

module.exports = findAcceptancesByShopId;
