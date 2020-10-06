const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/logger');

const handler = async (request, response) => {
  const domain = request.headers['x-shopify-shop-domain'];
  const Shop = await models.get('Shop');
  const shop = await Shop.findByDomain(domain);

  // Respond immediately so that Shopify does not consider this webhook as timed out.
  response.status(StatusCodes.OK).end();

  if (shop) {
    try {
      await shop.deactivate();
      logger.info(`App uninstalled for shop (${shop.toString()})`);
    } catch (error) {
      logger.error(
        `App uninstallation failed for shop (${shop.toString()})`,
        error
      );
    }
  } else {
    logger.warn(`Shop ${domain} not found for app uninstall webhook`);
  }
};

module.exports = handler;
