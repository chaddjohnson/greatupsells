const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { collectionId } = event.pathParameters;
    const Collection = await models.get('Collection');
    const collection = await Collection.findById(collectionId);
    const data = JSON.parse(event.body);

    if (!collection) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    delete data.__v;
    Object.assign(collection, data);

    try {
      await collection.validate();
    } catch (error) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    await collection.save();
    await collection.trackShopifyProducts();
    await collection.updateDependentOffers();
    await collection.execPopulate('shop');

    await logger.info(`Collection updated (${collection.toString()})`, {
      data
    });

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(collection)
    };
  } catch (error) {
    await logger.error(`Error updating collection`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
