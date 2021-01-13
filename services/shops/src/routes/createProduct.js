const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const Product = await models.get('Product');
    const data = JSON.parse(event.body);
    const product = new Product(data);

    try {
      await product.validate();
    } catch (error) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    await product.save();
    await product.trackShopifyCollections();
    await product.execPopulate('shop');

    logger.info(`Product created (${product.toString()})`, product);

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(product)
    };
  } catch (error) {
    logger.error(`Error creating product`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
