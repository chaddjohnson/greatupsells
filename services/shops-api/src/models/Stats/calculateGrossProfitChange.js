const models = require('..');

const calculateGrossProfitChange = async (startDate, endDate) => {
  // TODO: Sum shop.plan.price for active shops installed today.

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

  const { total } = await Shop.aggregate(pipelines);

  return total;
};

module.exports = calculateGrossProfitChange;
