const mongodbClient = require('../mongodbClient');

const updateActiveStatuses = async () => {
  const Shop = mongodbClient.connection.model('Shop');
  const cursor = Shop.find({}).cursor({ batchSize: 100 });

  cursor.addCursorFlag('noCursorTimeout', true);

  await cursor.eachAsync((shop) => shop.updateActiveStatus(), { parallel: 50 });
};

module.exports = updateActiveStatuses;
