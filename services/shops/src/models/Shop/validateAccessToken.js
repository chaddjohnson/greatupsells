const { StatusCodes } = require('http-status-codes');

const validateAccessToken = async (shop) => {
  if (!shop.accessToken) {
    throw new Error(`No access token available for shop ${shop.domain}`);
  }

  try {
    await shop.getShopifyApiClient().shop.get();
  } catch (error) {
    const validErrorHttpStatuses = [
      StatusCodes.PAYMENT_REQUIRED,
      StatusCodes.NOT_FOUND,
      StatusCodes.FORBIDDEN,
      StatusCodes.UNAUTHORIZED
    ];

    // Only consider the token to be invalid based on specific HTTP response codes.
    if (
      error.response &&
      validErrorHttpStatuses.includes(error.response.statusCode)
    ) {
      throw error;
    }
  }
};

module.exports = validateAccessToken;
