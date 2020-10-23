const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');

const handler = async (request, response) => {
  const data = response.body;
  const Product = await models.get('Product');
  const shopifyProductId = data.id;

  // Respond immediately so that Shopify does not consider this webhook as timed out.
  response.status(StatusCodes.OK).end();

  // Delete the product.
  await Product.findByIdAndDelete(shopifyProductId);

  // Delete copied products originalShopifyProductId.
  await Product.deleteMany({ originalShopifyProductId: shopifyProductId });

  // TODO: Remove product association from offers.
};

module.exports = handler;
