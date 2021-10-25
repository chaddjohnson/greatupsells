const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/greatupsells-logger');
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
    const { shopId, draftOrderId } = event.pathParameters;
    const Shop = await models.get('Shop');
    const shop = await Shop.findById(shopId);
    const { offerId, shopifyVariantId, quantity } = JSON.parse(event.body);

    const draftOrder = await shop.addDraftOrderLineItem(draftOrderId, {
      offerId,
      shopifyVariantId,
      quantity
    });

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
