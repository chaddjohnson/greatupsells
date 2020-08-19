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

module.exports.offerConversions = async (root, args, context) => {
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

    return await offer.findConversions(startAt, endAt);
  } catch (error) {
    logger.error(
      `Error retrieving offer conversions${
        shop ? ` for shop (${shop.toString()})` : ''
      }`,
      error
    );
    throw new ApolloError('Error retrieving offer conversions');
  }
};

module.exports.offerConversionRates = async (root, args, context) => {
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

    return await offer.findConversionRates(startAt, endAt);
  } catch (error) {
    logger.error(
      `Error retrieving offer conversion rates${
        shop ? ` for shop (${shop.toString()})` : ''
      }`,
      error
    );
    throw new ApolloError('Error retrieving offer conversion rates');
  }
};

module.exports.offerRevenueIncreases = async (root, args, context) => {
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

    return await offer.findRevenueIncreases(startAt, endAt);
  } catch (error) {
    logger.error(
      `Error retrieving offer revenue increases${
        shop ? ` for shop (${shop.toString()})` : ''
      }`,
      error
    );
    throw new ApolloError('Error retrieving offer revenue increases');
  }
};

module.exports.offerViews = async (root, args, context) => {
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

    return await offer.findViews(startAt, endAt);
  } catch (error) {
    logger.error(
      `Error retrieving offer views${
        shop ? ` for shop (${shop.toString()})` : ''
      }`,
      error
    );
    throw new ApolloError('Error retrieving offer views');
  }
};
