const mongoose = require('mongoose');

const findRevenueIncreasesByOfferId = async (offerId, startAt, endAt) => {
  if (typeof offerId !== 'object') {
    offerId = mongoose.Types.ObjectId(offerId);
  }

  const models = require('..');
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
  const groups = await OfferHit.aggregate(pipelines);
  const formattedData =
    groups.map(({ date, revenueIncrease }) => ({ date, revenueIncrease })) ||
    [];

  return formattedData;
};

module.exports = findRevenueIncreasesByOfferId;
