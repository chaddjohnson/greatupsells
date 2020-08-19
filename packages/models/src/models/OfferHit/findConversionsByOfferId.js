const mongoose = require('mongoose');

const findConversionsByOfferId = async (offerId, startAt, endAt) => {
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
        date: { $dateToString: { format: '%Y-%m-%d', date: '$convertedAt' } }
      }
    },
    {
      $group: {
        _id: { date: '$date' },
        conversions: { $sum: 1 }
      }
    },
    {
      $project: {
        date: '$_id.date',
        conversions: '$conversions'
      }
    }
  ];
  const groups = await OfferHit.aggregate(pipelines);
  const formattedData =
    groups.map(({ date, conversions }) => ({ date, conversions })) || [];

  return formattedData;
};

module.exports = findConversionsByOfferId;
