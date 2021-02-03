const mongodbClient = require('../mongodbClient');

const fixWebhooks = async () => {
  const Shop = mongodbClient.connection.model('Shop');
  const criteria = {
    active: true
  };
  const cursor = Shop.find(criteria).cursor({ batchSize: 100 });

  cursor.addCursorFlag('noCursorTimeout', true);

  await cursor.eachAsync((shop) => shop.createWebhooks(), { parallel: 50 });
};

module.exports = fixWebhooks;
