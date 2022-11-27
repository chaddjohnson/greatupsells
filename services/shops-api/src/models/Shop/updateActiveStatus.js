const getenv = require('getenv');
const logger = require('@greatupsells/logger');
const { StatusCodes } = require('http-status-codes');

const isSandbox = getenv.bool('SANDBOX', true);

const updateActiveStatus = async (shop) => {
  if (isSandbox) {
    return;
  }

  if (!shop.accessToken && !shop.active) {
    return;
  }

  // Deactivate the shop if no access token is available.
  if (!shop.accessToken) {
    await shop.deactivate();
    return;
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

    const { statusCode } = error.response;
    const cancelPlanErrorCodeWhitelist = [
      StatusCodes.NOT_FOUND,
      StatusCodes.FORBIDDEN
    ];
    const deactivationErrorCodeWhitelist = [
      StatusCodes.PAYMENT_REQUIRED,
      StatusCodes.NOT_FOUND,
      StatusCodes.FORBIDDEN,
      StatusCodes.METHOD_FAILURE, // shop unavailable
      StatusCodes.LOCKED
    ];
    const cancelShopPlan =
      error.response && cancelPlanErrorCodeWhitelist.includes(statusCode);
    const deactivateShop =
      error.response && deactivationErrorCodeWhitelist.includes(statusCode);

    if (cancelShopPlan) {
      await shop.cancelPlan();
    }

    if (deactivateShop) {
      await shop.deactivate();
    }

    if (!cancelShopPlan && !deactivateShop) {
      throw error;
    }
  }
};

module.exports = updateActiveStatus;
