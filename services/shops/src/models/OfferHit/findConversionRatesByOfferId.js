const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const mongodbClient = require('../mongodbClient');

const findConversionRatesByOfferId = async (offerId, startAt, endAt) => {
  if (typeof offerId !== 'object') {
    offerId = mongoose.Types.ObjectId(offerId);
  }

  const OfferHit = mongodbClient.connection.model('OfferHit');
  const pipelines = [
    {
      $match: {
        offer: offerId,
        $or: [
          {
            createdAt: {
              $gte: new Date(startAt),
              $lte: new Date(endAt)
            }
          },
          {
            convertedAt: {
              $gte: new Date(startAt),
              $lte: new Date(endAt)
            }
          }
        ]
      }
    },
    {
      $project: {
        date: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        converted: {
          $cond: [{ $gt: ['$convertedAt', 0] }, 1, 0]
        }
      }
    },
    {
      $group: {
        _id: { date: '$date' },
        impressions: { $sum: 1 },
        conversions: { $sum: { $max: '$converted' } }
      }
    },
    {
      $project: {
        date: '$_id.date',
        conversionRate: { $divide: ['$conversions', '$impressions'] }
      }
    }
  ];
  let results = [];

  results = await OfferHit.aggregate(pipelines);
  results =
    results.map(({ date, conversionRate }) => ({ date, conversionRate })) || [];
  results = sortBy(results, ({ date }) => new Date(date));

  return results;
};

module.exports = findConversionRatesByOfferId;
