const logger = require('@neatowebsolutions/upselling-logger');
const { StatusCodes } = require('http-status-codes');

module.exports = async (shop) => {
  if (!shop.accessToken && !shop.active) {
    return;
  }

  // If no access token is available, just mark the shop as inactive.
  if (!shop.accessToken) {
    logger.info(`Deactivating shop ${shop.domain}`);

    shop.active = false;

    return shop.save();
  }

  try {
    try {
      await shop.getShopifyApiClient().shop.get();

      if (shop.active) {
        return;
      }

      logger.info(`Activating shop ${shop.domain}`);

      // Mark the shop as active.
      shop.active = true;
      shop.uninstalledAt = undefined;

      return await shop.save();
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

        shop.active = false;

        return await shop.save();
      }
    }
  } catch (error) {
    logger.error(`Error activating/deactivating shop ${shop.domain}`, error);
    throw error;
  }
};
