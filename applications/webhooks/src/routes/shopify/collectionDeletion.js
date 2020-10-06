const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');

const handler = async (request, response) => {
  const data = response.body;
  const Collection = await models.get('Collection');
  const collection = await Collection.findByShopifyCollectionId(data.id);

  // Respond immediately so that Shopify does not consider this webhook as timed out.
  response.status(StatusCodes.OK).end();

  // Delete the collection if it exists.
  if (collection) {
    await collection.remove();
  }
};

module.exports = handler;
