const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const models = require('..');
const fillResults = require('./fillResults');

const findConversionRatesByOfferId = async (offerId, startAt, endAt) => {
  if (typeof offerId !== 'object') {
    offerId = mongoose.Types.ObjectId(offerId);
  }

  const OfferHit = await models.get('OfferHit');
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
        ],
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
  results = results.map(({ date, conversionRate }) => ({ date, conversionRate })) || [];
  results = sortBy(results, ({ date }) => new Date(date));
  results = fillResults(results, 'conversionRate');

  return results;
};

module.exports = findConversionRatesByOfferId;
