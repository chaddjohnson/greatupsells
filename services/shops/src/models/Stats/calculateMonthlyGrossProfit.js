const mongodbClient = require('../mongodbClient');

const calculateMonthlyGrossProfit = async () => {
  const Shop = mongodbClient.connection.model('Shop');
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

  const { total } = await Shop.aggregate(pipelines);

  return total;
};

module.exports = calculateMonthlyGrossProfit;
