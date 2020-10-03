const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const models = require('..');

const findRevenueIncreasesByOfferId = async (offerId, startAt, endAt) => {
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
          $dateToString: { format: '%Y-%m-%d', date: '$convertedAt' }
        },
        revenueIncrease: '$revenueIncrease'
      }
    },
    {
      $group: {
        _id: { date: '$date' },
        revenueIncrease: { $sum: '$revenueIncrease' }
      }
    },
    {
      $project: {
        date: '$_id.date',
        revenueIncrease: '$revenueIncrease'
      }
    }
  ];
  let data = [];

  data = await OfferHit.aggregate(pipelines);
  data =
    data.map(({ date, revenueIncrease }) => ({ date, revenueIncrease })) || [];
  data = sortBy(data, ({ date }) => new Date(date));

  return data;
};

module.exports = findRevenueIncreasesByOfferId;
