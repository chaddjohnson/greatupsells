const models = require('..');

const calculateGrossProfitChange = async (startDate, endDate) => {
  const Shop = await models.get('Shop');
  const pipelines = [
    {
      $match: {
        active: true,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$plan.price'
        }
      }
    }
  ];

  const results = await Shop.aggregate(pipelines);
  const total = results[0]?.total;

  return total || 0;
};

module.exports = calculateGrossProfitChange;
