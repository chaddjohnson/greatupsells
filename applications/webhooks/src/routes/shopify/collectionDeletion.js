const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');

const handler = async (request, response) => {
  const data = response.body;
  const Collection = await models.get('Collection');
  const shopifyCollectionId = data.id;

  // Respond immediately so that Shopify does not consider this webhook as timed out.
  response.status(StatusCodes.OK).end();

  // Delete the collection.
  await Collection.findByIdAndDelete(shopifyCollectionId);

  // TODO: Remove collection association from offers.
};

module.exports = handler;
