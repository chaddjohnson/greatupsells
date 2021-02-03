const mongodbClient = require('../mongodbClient');

const updatePlans = async () => {
  const Shop = mongodbClient.connection.model('Shop');
  const criteria = {
    active: true,
    'plan.level': { $ne: 'FREE' }
  };
  const cursor = Shop.find(criteria).cursor({ batchSize: 100 });

  cursor.addCursorFlag('noCursorTimeout', true);

  await cursor.eachAsync((shop) => shop.updatePlan(), { parallel: 50 });
};

module.exports = updatePlans;
