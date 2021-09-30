const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await mongodbClient.connect();

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const { orderId } = event.pathParameters;
    const [Order] = await Promise.all([
      models.get('Order'),
      models.get('Shop')
    ]);
    const order = await Order.findById(orderId);
    const data = JSON.parse(event.body);

    if (!order) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    delete data.__v;
    Object.assign(order, data);

    try {
      await order.validate();
    } catch (error) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    await order.save();
    await order.execPopulate('shop');

    await logger.info(`Order updated (${order.toString()})`, { order });

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(order)
    };
  } catch (error) {
    await logger.error(`Error updating order`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
