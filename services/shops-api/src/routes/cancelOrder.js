const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log('Connecting to MongoDB');
  await mongodbClient.connect();
  console.log('Connected to MongoDB');

  console.log('Before warming up');
  if (event.source === 'serverless-plugin-warmup') {
    console.log('Warming up');
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const { orderId } = event.pathParameters;
    const Order = await models.get('Order');
    const order = await Order.findById(orderId);

    if (!order) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    await order.cancel();
    await logger.info(`Order canceled (${order.toString()})`, { order });

    return {
      statusCode: StatusCodes.NO_CONTENT
    };
  } catch (error) {
    await logger.error(`Error canceling order`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
