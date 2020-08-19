const mongoose = require('mongoose');

const findAcceptancesByOfferId = async (offerId, startAt, endAt) => {
  if (typeof offerId !== 'object') {
    offerId = mongoose.Types.ObjectId(offerId);
  }

  const models = require('..');
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
  const groups = await OfferHit.aggregate(pipelines);
  const formattedData =
    groups.map(({ date, acceptances }) => ({ date, acceptances })) || [];

  return formattedData;
};

module.exports = findAcceptancesByOfferId;
