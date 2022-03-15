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
        date: {
          $dateToString: {
            format: '%Y-%m-%dT12:00:00Z',
            date: '$acceptedAt'
          }
        }
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
  let results = [];

  results = await OfferHit.aggregate(pipelines);
  results =
    results.map(({ date, acceptances }) => ({ date, acceptances })) || [];
  results = sortBy(results, ({ date }) => new Date(date));

  return results;
};

module.exports = findAcceptancesByOfferId;
