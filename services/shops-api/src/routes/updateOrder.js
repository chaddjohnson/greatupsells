const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await mongodbClient.connect();

  try {
    const { orderId } = event.pathParameters;
    const [Order] = await Promise.all([
      models.get('Order'),
      models.get('Shop')
    ]);
    let order = await Order.findById(orderId);
    const { revenueIncrease } = order;
    const data = JSON.parse(event.body);
    const { shopifyOrderData } = data;

    if (!order) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    delete data.__v;

    try {
      await order.replaceOne({
        ...data,

        // Fields managed only by this API.
        revenueIncrease
      });
    } catch (error) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    // Refresh document, and force middleware to run.
    order = await Order.findById(orderId);
    await order.save();

    // Track conversions if the order is marked as paid.
    if (shopifyOrderData.financial_status === 'paid') {
      await order.trackConversions();
    }

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
