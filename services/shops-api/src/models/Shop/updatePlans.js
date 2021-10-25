const logger = require('@neatowebsolutions/greatupsells-logger');
const models = require('..');

const updatePlans = async () => {
  const Shop = await models.get('Shop');
  const criteria = {
    active: true,
    'plan.level': { $ne: 'FREE' }
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
};

module.exports = updatePlans;
