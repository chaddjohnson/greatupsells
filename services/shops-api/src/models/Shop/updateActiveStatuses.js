const logger = require('@neatowebsolutions/upselling-logger');
const models = require('..');

const updateActiveStatuses = async () => {
  const Shop = await models.get('Shop');
  const cursor = Shop.find({}).cursor({ batchSize: 100 });

  cursor.addCursorFlag('noCursorTimeout', true);

  await cursor.eachAsync(
    async (shop) => {
      try {
        await shop.updateActiveStatus();
      } catch (error) {
        await logger.warn(
          `Error updating shop active status (${shop.toString()})`,
          error
        );
      }
    },
    { parallel: 50 }
  );
};

module.exports = updateActiveStatuses;
