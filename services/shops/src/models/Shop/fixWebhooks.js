const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../mongodbClient');

const fixWebhooks = async () => {
  const Shop = mongodbClient.connection.model('Shop');
  const criteria = {
    active: true
  };
  const cursor = Shop.find(criteria).cursor({ batchSize: 100 });

  cursor.addCursorFlag('noCursorTimeout', true);

  await cursor.eachAsync(
    async (shop) => {
      try {
        await shop.createWebhooks();
      } catch (error) {
        logger.warn(`Error updating shop webhooks (${shop.toString()})`, error);
      }
    },
    { parallel: 50 }
  );
};

module.exports = fixWebhooks;
