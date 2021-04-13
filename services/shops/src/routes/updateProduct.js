const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { productId } = event.pathParameters;
    const Product = await models.get('Product');
    const product = await Product.findById(productId);
    const data = JSON.parse(event.body);

    delete data.__v;
    Object.assign(product, data);

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
    await logger.info(`Product updated (${product.toString()})`, data);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(product)
    };
  } catch (error) {
    await logger.error(`Error updating product`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
