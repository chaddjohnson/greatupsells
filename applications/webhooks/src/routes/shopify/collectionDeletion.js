const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');

const handler = async (request, response) => {
  const data = response.body;
  const Collection = await models.get('Collection');

  // Respond immediately so that Shopify does not consider this webhook as timed out.
  response.status(StatusCodes.OK).end();

  // Delete the collection.
  await Collection.findByIdAndDelete(data.id);
};

module.exports = handler;
