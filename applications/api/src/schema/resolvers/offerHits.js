const { ApolloError, AuthenticationError } = require('apollo-server-lambda');
const logger = require('@neatowebsolutions/logger');

module.exports.offerAcceptances = async (root, args, context) => {
  const { shop, Offer } = context;
  const { id, startAt, endAt } = args;

  try {
    const offer = await Offer.findById(id);

    if (!offer) {
      throw new ApolloError('Offer not found');
    }

    if (shop && offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
      logger.warn(
        `Unauthorized access attempt for offer hits (${offer.toString()}) by shop (${shop.toString()})`
      );
      throw new AuthenticationError('Unauthorized');
    }

    return await offer.findAcceptances(startAt, endAt);
  } catch (error) {
    logger.error(
      `Error retrieving offer acceptances${
        shop ? ` for shop (${shop.toString()})` : ''
      }`,
      error
    );
    throw new ApolloError('Error retrieving offer acceptances');
  }
};
