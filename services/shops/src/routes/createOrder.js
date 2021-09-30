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
    const [Order] = await Promise.all([
      models.get('Order'),
      models.get('Shop')
    ]);
    const data = JSON.parse(event.body);
    const order = new Order(data);
    let offerHits = [];

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

    offerHits = await order.trackConversions();

    // Only track orders resulting in offer conversions.
    if (offerHits.length === 0) {
      await logger.debug(
        `Skipping order as no conversions were recorded (${order.toString()})`
      );

      await order.deleteOne();
    } else {
      await logger.info(`Order created (${order.toString()})`, { data });
    }

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(order)
    };
  } catch (error) {
    await logger.error(`Error creating order`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
