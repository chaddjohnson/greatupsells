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
    const { collectionId } = event.pathParameters;
    const [Collection] = await Promise.all([
      models.get('Collection'),
      models.get('Shop')
    ]);
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
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
