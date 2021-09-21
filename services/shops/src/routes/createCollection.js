const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUp - Lambda is warm!'); // eslint-disable-line no-console
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const Collection = await models.get('Collection');
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
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
