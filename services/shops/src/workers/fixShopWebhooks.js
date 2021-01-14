const fs = require('fs-extra');
const isLambda = require('is-lambda');
const { logger, cleanTmp } = require('../utilities');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await logger.info(`Running job fixShopWebhooks`);

  try {
    if (isLambda) {
      await fs.emptyDir('/tmp');
    }

    // const Shop = await models.get('Shop');

    // ...
    // TODO: Run in parallel for shops.
  } catch (error) {
    await logger.warn(`... failed`, error, event);
    throw error;
  }
};
