const logger = require('@greatupsells/logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const Shop = await models.get('Shop');
    const cursor = Shop.find({}).cursor({ batchSize: 100 });

    cursor.addCursorFlag('noCursorTimeout', true);

    await cursor.eachAsync(
      async (shop) => {
        try {
          await shop.updateActiveStatus();
        } catch (error) {
          await logger.warn(`Error updating shop active status (${shop.toString()})`, error);
        }
      },
      { parallel: 50 }
    );
  } catch (error) {
    await logger.error(`Job updateShopActiveStatuses failed`, error, { event });
    throw error;
  }
};

module.exports.handler = handler;
