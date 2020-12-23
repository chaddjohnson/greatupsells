const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/upselling-logger');

const handler = async (request, response) => {
  const data = response.body;
  const Product = await models.get('Product');
  const shopifyProductId = data.id;

  // Delete the product.
  await Product.findByIdAndDelete(shopifyProductId);

  // Delete copied products originalShopifyProductId.
  await Product.deleteMany({ originalShopifyProductId: shopifyProductId });

  // TODO: Remove product association from offers.

  logger.debug(`Product deleted via webhook`, data);

  response.status(StatusCodes.OK).end();
};

module.exports = handler;
