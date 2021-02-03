const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const mongodbClient = require('../mongodbClient');

const findViewsByOfferId = async (offerId, startAt, endAt) => {
  if (typeof offerId !== 'object') {
    offerId = mongoose.Types.ObjectId(offerId);
  }

  const OfferHit = mongodbClient.connection.model('OfferHit');
  const pipelines = [
    {
      $match: {
        offer: offerId,
        createdAt: {
          $gte: new Date(startAt),
          $lte: new Date(endAt)
        }
      }
    },
    {
      $project: {
        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
      }
    },
    {
      $group: {
        _id: { date: '$date' },
        views: { $sum: 1 }
      }
    },
    {
      $project: {
        date: '$_id.date',
        views: '$views'
      }
    }
  ];
  let results = [];

  results = await OfferHit.aggregate(pipelines);
  results = results.map(({ date, views }) => ({ date, views })) || [];
  results = sortBy(results, ({ date }) => new Date(date));

  return results;
};

module.exports = findViewsByOfferId;
