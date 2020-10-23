const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');

const handler = async (request, response) => {
  const data = response.body;
  const Collection = await models.get('Collection');
  const shopifyCollectionId = data.id;

  // Delete the collection.
  await Collection.findByIdAndDelete(shopifyCollectionId);

  // TODO: Remove collection association from offers.

  response.status(StatusCodes.OK).end();
};

module.exports = handler;
