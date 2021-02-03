const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const mongodbClient = require('../mongodbClient');

const findConversionsByOfferId = async (offerId, startAt, endAt) => {
  if (typeof offerId !== 'object') {
    offerId = mongoose.Types.ObjectId(offerId);
  }

  const OfferHit = mongodbClient.connection.model('OfferHit');
  const pipelines = [
    {
      $match: {
        offer: offerId,
        convertedAt: {
          $gte: new Date(startAt),
          $lte: new Date(endAt)
        }
      }
    },
    {
      $project: {
        date: { $dateToString: { format: '%Y-%m-%d', date: '$convertedAt' } }
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

  return results;
};

module.exports = findConversionsByOfferId;
