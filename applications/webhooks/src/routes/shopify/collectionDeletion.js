const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/upselling-logger');

const handler = async (request, response) => {
  const data = response.body;
  const Collection = await models.get('Collection');
  const shopifyCollectionId = data.id;

  // Delete the collection.
  await Collection.findByIdAndDelete(shopifyCollectionId);

  // TODO: Remove collection association from offers.

  logger.debug(`Collection deleted via webhook`, data);

  response.status(StatusCodes.OK).end();
};

module.exports = handler;
