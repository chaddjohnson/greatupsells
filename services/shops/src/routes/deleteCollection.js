const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { collectionId } = event.pathParameters;
    const Collection = await models.get('Collection');
    const Offer = await models.get('Offer');
    const Product = await models.get('Product');
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
    await Product.updateMany(
      {},
      { $pull: { shopifyCollectionIds: shopifyCollectionId } }
    );

    await logger.info(`Collection deleted (${collection.toString()})`);

    return {
      statusCode: StatusCodes.NO_CONTENT
    };
  } catch (error) {
    await logger.error(`Error deleting collection`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
