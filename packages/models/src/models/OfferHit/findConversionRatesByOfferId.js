const mongoose = require('mongoose');
const { sortBy } = require('lodash');

const findConversionRatesByOfferId = async (offerId, startAt, endAt) => {
  if (typeof offerId !== 'object') {
    offerId = mongoose.Types.ObjectId(offerId);
  }

  const models = require('..');
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
        views: { $sum: 1 },
        conversions: { $sum: { $max: '$converted' } }
      }
    },
    {
      $project: {
        date: '$_id.date',
        conversionRate: { $divide: ['$conversions', '$views'] }
      }
    }
  ];
  let data = [];

  data = await OfferHit.aggregate(pipelines);
  data =
    data.map(({ date, conversionRate }) => ({ date, conversionRate })) || [];
  data = sortBy(data, ({ date }) => new Date(date));

  return data;
};

module.exports = findConversionRatesByOfferId;
