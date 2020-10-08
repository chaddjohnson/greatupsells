const logger = require('@neatowebsolutions/logger');
const { StatusCodes } = require('http-status-codes');

module.exports = async (shop) => {
  const models = require('..');
  const Shop = await models.get('Shop');

  if (!shop.accessToken && !shop.active) {
    return;
  }

  // If no access token is available, just mark the shop as inactive.
  if (!shop.accessToken) {
    logger.info(`Deactivating shop ${shop.domain}`);

    // Use one round trip to prevent write conflicts.
    return Shop.findByIdAndUpdate(shop.id, {
      active: false
    });
  }

  try {
    try {
      await shop.getShopifyApiClient().shop.get();

      if (shop.active) {
        return;
      }

      logger.info(`Activating shop ${shop.domain}`);

      // Use one round trip to prevent write conflicts.
      return await Shop.findByIdAndUpdate(shop.id, {
        active: true,
        uninstalledAt: undefined
      });
    } catch (error) {
      // No need to proceed with deactivation if the shop is already deactivated.
      if (!shop.active) {
        return;
      }

      const errorCodeWhitelist = [
        StatusCodes.PAYMENT_REQUIRED,
        StatusCodes.NOT_FOUND,
        StatusCodes.FORBIDDEN,
        StatusCodes.METHOD_FAILURE, // shop unavailable
        StatusCodes.LOCKED
      ];

      if (
        error.response &&
        errorCodeWhitelist.includes(error.response.statusCode)
      ) {
        logger.info(`Deactivating shop ${shop.domain}`);

        // Use one round trip to prevent write conflicts.
        return await Shop.findByIdAndUpdate(shop.id, {
          active: false
        });
      }
    }
  } catch (error) {
    logger.error(`Error activating/deactivating shop ${shop.domain}`, error);
    throw error;
  }
};
