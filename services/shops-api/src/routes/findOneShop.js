const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const isPostPurchaseAppInUseCache = {};
const ttl = 5 * 60 * 1000; // 5 minutes

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

    const now = Date.now();

    // Check the cache.
    if (isPostPurchaseAppInUseCache[shopId] && isPostPurchaseAppInUseCache[shopId].timestamp + ttl > now) {
      return {
        statusCode: StatusCodes.OK,
        body: JSON.stringify({
          ...shop.toObject(),
          isPostPurchaseAppInUse: isPostPurchaseAppInUseCache[shopId].value
        })
      };
    }

    // Determine whether this app is currently selected as the post-purchase app for the shop.
    // Determine whether the app embed block is enabled for the current theme.
    const isPostPurchaseAppInUse = await shop.getIsPostPurchaseAppInUse();

    // Store in cache only if the value is true
    if (isPostPurchaseAppInUse) {
      isPostPurchaseAppInUseCache[shopId] = {
        value: isPostPurchaseAppInUse,
        timestamp: now
      };
    }

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({
        ...shop.toObject(),
        isPostPurchaseAppInUse
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
