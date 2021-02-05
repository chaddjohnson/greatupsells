const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { shopId } = event.pathParameters;
    const Shop = await models.get('Shop');
    const shop = await Shop.findById(shopId);
    const data = JSON.parse(event.body);
    const shopifyPlanCanceled = shop.shopifyPlan === 'cancelled';

    if (!shop) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    Object.assign(shop, data);

    try {
      await shop.validate();
    } catch (error) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    await shop.save();

    // Deactivate the shop for our app if the Shopify shop plan is canceled.
    if (!shopifyPlanCanceled && shop.shopifyPlan === 'cancelled') {
      await shop.cancelPlan();
      await shop.deactivate();
    }

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(shop)
    };
  } catch (error) {
    await logger.error(`Error updating shop`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
