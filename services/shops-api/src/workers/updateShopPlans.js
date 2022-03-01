const logger = require('@greatupsells/logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const Shop = await models.get('Shop');
    const criteria = {
      active: true,
      'plan.chargeId': { $ne: null }
    };
    const cursor = Shop.find(criteria).cursor({ batchSize: 100 });

    cursor.addCursorFlag('noCursorTimeout', true);

    await cursor.eachAsync(
      async (shop) => {
        try {
          await shop.updatePlan();
        } catch (error) {
          await logger.warn(
            `Error verifying and updating plan statuses for shop (${shop.toString()})`,
            error
          );
        }
      },
      { parallel: 50 }
    );
  } catch (error) {
    await logger.error(`Job updateShopPlans failed`, error, { event });
    throw error;
  }
};

module.exports.handler = handler;
