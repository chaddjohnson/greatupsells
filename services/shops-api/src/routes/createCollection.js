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
    const [Collection] = await Promise.all([
      models.get('Collection'),
      models.get('Shop')
    ]);
    const data = JSON.parse(event.body);
    const collection = new Collection(data);

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
    await collection.execPopulate('shop');

    await logger.info(`Collection created (${collection.toString()})`, {
      data
    });

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(collection)
    };
  } catch (error) {
    await logger.error(`Error creating collection`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
