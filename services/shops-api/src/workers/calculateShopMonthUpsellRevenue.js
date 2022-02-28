const logger = require('@greatupsells/logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const Shop = await models.get('Shop');
    const criteria = {
      active: true,
      'plan.active': true
    };
    const cursor = Shop.find(criteria).cursor({ batchSize: 100 });

    cursor.addCursorFlag('noCursorTimeout', true);

    await cursor.eachAsync(
      async (shop) => {
        try {
          // Calculate month upsell revenue for the shop.
          const monthUpsellRevenue = await shop.calculateMonthUpsellRevenue();

          await Shop.findByIdAndUpdate(shop.id, {
            'plan.monthUpsellRevenue': monthUpsellRevenue
          });
        } catch (error) {
          await logger.warn(
            `Error calculating month upsell revenue for shop (${shop.toString()})`,
            error
          );
        }
      },
      { parallel: 50 }
    );
  } catch (error) {
    await logger.error(`Job calculateShopMonthUpsellRevenue failed`, error, {
      event
    });
    throw error;
  }
};

module.exports.handler = handler;
