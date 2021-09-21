const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUp - Lambda is warm!'); // eslint-disable-line no-console
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const { productId } = event.pathParameters;
    const Product = await models.get('Product');
    const Offer = await models.get('Offer');
    const product = await Product.findById(productId);
    const { shopifyProductId } = product;

    if (!product) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    // Delete the product.
    await Product.findByIdAndDelete(productId);

    // Remove product association from offers.
    await Offer.updateMany(
      {},
      { $pull: { offeredProducts: { shopifyProductId } } },
      { $pull: { triggerProducts: { shopifyProductId } } }
    );

    await logger.info(`Product deleted (${product.toString()})`, { product });

    return {
      statusCode: StatusCodes.NO_CONTENT
    };
  } catch (error) {
    await logger.error(`Error deleting product`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
