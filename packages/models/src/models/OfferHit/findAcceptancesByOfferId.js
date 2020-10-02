const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const models = require('..');

const findAcceptancesByOfferId = async (offerId, startAt, endAt) => {
  if (typeof offerId !== 'object') {
    offerId = mongoose.Types.ObjectId(offerId);
  }

  const OfferHit = await models.get('OfferHit');
  const pipelines = [
    {
      $match: {
        offer: offerId,
        acceptedAt: {
          $gte: new Date(startAt),
          $lte: new Date(endAt)
        }
      }
    },
    {
      $project: {
        date: { $dateToString: { format: '%Y-%m-%d', date: '$acceptedAt' } }
      }
    },
    {
      $group: {
        _id: { date: '$date' },
        acceptances: { $sum: 1 }
      }
    },
    {
      $project: {
        date: '$_id.date',
        acceptances: '$acceptances'
      }
    }
  ];
  let data = [];

  data = await OfferHit.aggregate(pipelines);
  data = data.map(({ date, acceptances }) => ({ date, acceptances })) || [];
  data = sortBy(data, ({ date }) => new Date(date));

  return data;
};

module.exports = findAcceptancesByOfferId;
