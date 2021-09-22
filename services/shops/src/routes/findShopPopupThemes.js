const mongoose = require('mongoose');
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
    const { shopId } = event.pathParameters;
    const PopupTheme = await models.get('PopupTheme');
    const popupThemes = await PopupTheme.find({
      offer: null, // must not belong to an offer
      $or: [
        { shop: null }, // shared
        { shop: mongoose.Types.ObjectId(shopId) } // or belonging to the shop
      ]
    }).sort({ displayOrder: 1 });

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(popupThemes)
    };
  } catch (error) {
    await logger.error(`Error retrieving shop popup themes`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
