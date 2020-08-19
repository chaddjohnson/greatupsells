const mongoose = require('mongoose');

const findViewsByOfferId = async (offerId, startAt, endAt) => {
  if (typeof offerId !== 'object') {
    offerId = mongoose.Types.ObjectId(offerId);
  }

  const models = require('..');
  const OfferHit = await models.get('OfferHit');
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
  const groups = await OfferHit.aggregate(pipelines);
  const formattedData =
    groups.map(({ date, views }) => ({ date, views })) || [];

  return formattedData;
};

module.exports = findViewsByOfferId;
