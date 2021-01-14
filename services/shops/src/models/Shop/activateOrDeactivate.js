const logger = require('@neatowebsolutions/upselling-logger');
const { StatusCodes } = require('http-status-codes');

const activateOrDeactivate = async (shop) => {
  if (!shop.accessToken && !shop.active) {
    return;
  }

  // If no access token is available, just mark the shop as inactive.
  if (!shop.accessToken) {
    return await shop.deactivate();
  }

  try {
    await shop.getShopifyApiClient().shop.get();

    if (shop.active) {
      return;
    }

    await logger.info(`Activating shop ${shop.domain}`);

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
      return await shop.deactivate();
    }
  }
};

module.exports = activateOrDeactivate;
