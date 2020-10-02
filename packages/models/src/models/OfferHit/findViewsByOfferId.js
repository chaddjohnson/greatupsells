const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const models = require('..');

const findViewsByOfferId = async (offerId, startAt, endAt) => {
  if (typeof offerId !== 'object') {
    offerId = mongoose.Types.ObjectId(offerId);
  }

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
  let data = [];

  data = await OfferHit.aggregate(pipelines);
  data = data.map(({ date, views }) => ({ date, views })) || [];
  data = sortBy(data, ({ date }) => new Date(date));

  return data;
};

module.exports = findViewsByOfferId;
