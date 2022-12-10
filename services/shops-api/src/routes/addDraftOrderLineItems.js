const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await mongodbClient.connect();

  try {
    const { shopId, draftOrderId } = event.pathParameters;
    const Shop = await models.get('Shop');
    const shop = await Shop.findById(shopId);
    const items = JSON.parse(event.body);
    const draftOrder = await shop.addDraftOrderLineItems(draftOrderId, items);

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(draftOrder)
    };
  } catch (error) {
    await logger.error(`Error adding draft order line item`, error, {
      event
    });

    // A 404 will be thrown by Shopify if the draft order is not found for the shop.
    if (error?.response?.statusCode === StatusCodes.NOT_FOUND) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
