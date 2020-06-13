const httpStatus = require('http-status-codes');

module.exports = async (shop) => {
  if (!shop.accessToken) {
    throw new Error(`No access token available for shop ${shop.domain}`);
  }

  try {
    await shop.getShopifyApiClient().shop.get();
  } catch (error) {
    const errorHttpStatuses = [
      httpStatus.PAYMENT_REQUIRED,
      httpStatus.NOT_FOUND,
      httpStatus.FORBIDDEN,
      httpStatus.UNAUTHORIZED
    ];

    // Only consider the token to be invalid based on specific HTTP response codes.
    if (
      error.response &&
      errorHttpStatuses.includes(error.response.statusCode)
    ) {
      throw error;
    }
  }
};
