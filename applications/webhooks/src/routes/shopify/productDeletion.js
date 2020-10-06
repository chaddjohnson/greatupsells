const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');

const handler = async (request, response) => {
  const data = response.body;
  const Product = await models.get('Product');
  const product = await Product.findByShopifyProductId(data.id);

  // Respond immediately so that Shopify does not consider this webhook as timed out.
  response.status(StatusCodes.OK).end();

  // Delete the product if it exists.
  if (product) {
    await product.remove();
  }

  // Delete copied products originalShopifyProductId.
  await Product.deleteMany({ originalShopifyProductId: data.id });
};

module.exports = handler;
