const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
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
    const { shopifyOrderData } = data;
    const order = new Order(data);
    let offerHits = [];

    try {
      await order.validate();
    } catch (error) {
      logger.debug(`ERROR: ${error.message}`);

      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    await order.save();
    await order.trackPairedPurchases();
    await order.execPopulate('shop');

    // Track conversions if the order is marked as paid.
    if (shopifyOrderData.financial_status === 'paid') {
      offerHits = await order.trackConversions();
    }

    // Only track orders resulting in offer conversions.
    if (offerHits.length === 0) {
      await logger.debug(
        `No conversions were recorded for order (${order.toString()})`
      );
    } else {
      await logger.info(
        `Order with conversions created (${order.toString()})`,
        { data }
      );
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
