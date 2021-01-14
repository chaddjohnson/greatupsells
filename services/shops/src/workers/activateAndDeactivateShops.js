const fs = require('fs-extra');
const isLambda = require('is-lambda');
const logger = require('@neatowebsolutions/upselling-logger');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await logger.info(`Running job activateAndDeactivateShops`);

  try {
    if (isLambda) {
      await fs.emptyDir('/tmp');
    }

    // const Shop = await models.get('Shop');

    // TODO: Run in parallel for shops.
    try {
      //
    } catch (error) {
      await logger.error(
        `Error activating/deactivating shop ${shop.domain}`,
        error
      );
    }
  } catch (error) {
    await logger.error(
      `Error activating/deactivating shop ${shop.domain}`,
      error
    );
    throw error;
  }
};
