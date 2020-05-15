const logger = require('@neatowebsolutions/logger');
const httpStatus = require('http-status-codes');

module.exports = async (shop) => {
  if (!shop.accessToken && !shop.active) {
    return;
  }

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

      shop.active = true;
      shop.uninstalledAt = undefined;

      return shop.save();
    } catch (error) {
      // No need to proceed with deactivation if the shop is already deactivated.
      if (!shop.active) {
        return;
      }

      const errorCodeWhitelist = [
        httpStatus.PAYMENT_REQUIRED,
        httpStatus.NOT_FOUND,
        httpStatus.FORBIDDEN,
        httpStatus.METHOD_FAILURE, // shop unavailable
        httpStatus.LOCKED
      ];

      if (
        error.response &&
        errorCodeWhitelist.includes(error.response.statusCode)
      ) {
        logger.info(`Deactivating shop ${shop.domain}`);

        shop.active = false;
        return shop.save();
      }
    }
  } catch (error) {
    logger.error(`Error activating/deactivating shop ${shop.domain}`, error);
    throw error;
  }
};
