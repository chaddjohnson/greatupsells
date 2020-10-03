const { ApolloError, AuthenticationError } = require('apollo-server-lambda');
const logger = require('@neatowebsolutions/logger');

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
      error,
      args
    );
    throw new ApolloError('Error retrieving offer views');
  }
};

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
      error,
      args
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
      error,
      args
    );
    throw new ApolloError('Error retrieving offer conversions');
  }
};

module.exports.offerConversionRates = async (root, args, context) => {
  const { shop, Offer } = context;
  const { id, startAt, endAt } = args;
  let offer = null;

  try {
    offer = await Offer.findById(id);

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
      error,
      args
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
      error,
      args
    );
    throw new ApolloError('Error retrieving offer revenue increases');
  }
};

module.exports.trackOfferView = async (root, args, context) => {
  const { shop, ip, Offer } = context;
  const { offerId, productId, variantId } = args;
  let offer = null;

  if (!shop) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    offer = await Offer.findById(offerId);

    if (!offer) {
      throw new ApolloError('Offer not found');
    }

    await offer.trackView(productId, variantId, ip);
  } catch (error) {
    throw new ApolloError('Error tracking offer view');
  }
};

module.exports.trackOfferAcceptance = async (root, args, context) => {
  const { shop, OfferHit } = context;
  const { offerHitId, productId, variantId, quantity } = args;
  let offerHit = null;

  if (!shop) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    offerHit = await OfferHit.findById(offerHitId);

    if (!offerHit) {
      throw new ApolloError('Offer view not found');
    }

    await offerHit.trackAcceptance(productId, variantId, quantity);
  } catch (error) {
    throw new ApolloError('Error tracking offer acceptance');
  }
};
