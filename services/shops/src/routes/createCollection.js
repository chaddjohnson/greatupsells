const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

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

    await logger.info(
      `Collection created (${collection.toString()})`,
      collection
    );

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(collection)
    };
  } catch (error) {
    await logger.error(`Error creating collection`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
