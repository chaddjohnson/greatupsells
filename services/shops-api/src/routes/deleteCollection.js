const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
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
    const [Collection, Offer, Product] = await Promise.all([
      models.get('Collection'),
      models.get('Offer'),
      models.get('Product')
    ]);
    const collection = await Collection.findById(collectionId);
    const { shopifyCollectionId } = collection;

    if (!collection) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    // Delete the collection.
    await Collection.findByIdAndDelete(collectionId);

    // Remove collection association from offers.
    await Offer.updateMany(
      {},
      { $pull: { offeredCollections: { shopifyCollectionId } } },
      { $pull: { triggerCollections: { shopifyCollectionId } } }
    );

    // Dissociate collection from products.
    await Product.updateMany({}, { $pull: { shopifyCollectionIds: shopifyCollectionId } });

    await logger.info(`Collection deleted (${collection.toString()})`);

    return {
      statusCode: StatusCodes.NO_CONTENT
    };
  } catch (error) {
    await logger.error(`Error deleting collection`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
