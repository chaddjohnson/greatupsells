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
    const { shopId } = event.pathParameters;
    const Shop = await models.get('Shop');
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    // Determine whether this app is currently selected as the post-purchase app for the shop.
    // Determine whether the app embed block is enabled for the current theme.
    const [isPostPurchaseAppInUse, isEmbedBlockEnabled] = await Promise.all([
      shop.getIsPostPurchaseAppInUse(),
      shop.getAppEmbedBlockIsInstalledAndEnabled()
    ]);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({
        ...shop.toObject(),
        isPostPurchaseAppInUse,
        isEmbedBlockEnabled
      })
    };
  } catch (error) {
    await logger.error(`Error retrieving shop`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
