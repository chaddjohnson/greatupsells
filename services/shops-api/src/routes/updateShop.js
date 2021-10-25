const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsellslogger');
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
    const { shopId } = event.pathParameters;
    const Shop = await models.get('Shop');
    const shop = await Shop.findById(shopId);
    const {
      shopifyShopId,
      plan,
      offerImpressionCount,
      offerAcceptanceCount,
      offerConversionCount,
      offerConversionRate,
      revenueIncrease
    } = shop;
    const shopifyPlanCanceled = shop.shopifyPlan === 'cancelled';
    const data = JSON.parse(event.body);

    if (!shop) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    delete data.__v;

    try {
      await shop.replaceOne({
        ...data,

        // Fields managed only by this API.
        shopifyShopId,
        plan,
        offerImpressionCount,
        offerAcceptanceCount,
        offerConversionCount,
        offerConversionRate,
        revenueIncrease
      });
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
    await logger.error(`Error updating shop`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
