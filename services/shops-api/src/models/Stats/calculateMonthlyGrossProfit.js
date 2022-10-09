const models = require('..');

const calculateMonthlyGrossProfit = async () => {
  const Shop = await models.get('Shop');
  const pipelines = [
    {
      $match: {
        active: true
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

  return total;
};

module.exports = calculateMonthlyGrossProfit;
