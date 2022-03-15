const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const models = require('..');

const findConversionsByOfferId = async (offerId, startAt, endAt) => {
  if (typeof offerId !== 'object') {
    offerId = mongoose.Types.ObjectId(offerId);
  }

  const OfferHit = await models.get('OfferHit');
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

  return results;
};

module.exports = findConversionsByOfferId;
