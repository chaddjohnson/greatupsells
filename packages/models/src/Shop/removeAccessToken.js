const logger = require('@neatowebsolutions/logger');

const removeAccessToken = async (shop) => {
  if (!shop.accessToken) {
    return;
  }

  try {
    logger.warn(
      `Removing invalid Shopify access token ${shop.accessToken} for shop ${shop.domain}`
    );

    // Remove the access token.
    shop.accessToken = undefined;

    await shop.save();
  } catch (error) {
    logger.warn(
      `Unable to remove Shopify access token ${shop.accessToken} for shop ${shop.domain}`,
      error
    );
  }
};

module.exports = removeAccessToken;
