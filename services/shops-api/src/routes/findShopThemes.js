const mongoose = require('mongoose');
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
    const Theme = await models.get('Theme');
    const themes = await Theme.find({
      offer: null, // must not belong to an offer
      $or: [
        { shop: null }, // shared
        { shop: mongoose.Types.ObjectId(shopId) } // or belonging to the shop
      ]
    }).sort({ displayOrder: 1 });

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(themes)
    };
  } catch (error) {
    await logger.error(`Error retrieving shop themes`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
