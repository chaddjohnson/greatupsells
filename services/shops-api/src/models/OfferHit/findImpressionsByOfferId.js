const mongoose = require('mongoose');
const { sortBy } = require('lodash');
const models = require('..');
const fillResults = require('./fillResults');

const findImpressionsByOfferId = async (offerId, startAt, endAt) => {
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
        },
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
        }
      }
    },
    {
      $group: {
        _id: { date: '$date' },
        impressions: { $sum: 1 }
      }
    },
    {
      $project: {
        date: '$_id.date',
        impressions: '$impressions'
      }
    }
  ];
  let results = [];

  results = await OfferHit.aggregate(pipelines);
  results = results.map(({ date, impressions }) => ({ date, impressions })) || [];
  results = sortBy(results, ({ date }) => new Date(date));
  results = fillResults(results, 'impressions');

  return results;
};

module.exports = findImpressionsByOfferId;
