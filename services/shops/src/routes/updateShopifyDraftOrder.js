const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { shopId, draftOrderId, shopifyVariantId } = event.pathParameters;
    const Shop = await models.get('Shop');
    const shop = await Shop.findById(shopId);
    const { quantity } = JSON.parse(event.body);

    const draftOrder = await shop.updateShopifyDraftOrderVariantQuantity(
      draftOrderId,
      shopifyVariantId,
      quantity
    );

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(draftOrder)
    };
  } catch (error) {
    await logger.error(`Error updating draft order line item`, error, {
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
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
