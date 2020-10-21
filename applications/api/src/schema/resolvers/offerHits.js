const {
  ApolloError,
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-lambda');
const logger = require('@neatowebsolutions/logger');

module.exports.offerViews = async (root, args, context) => {
  const { shop, Offer } = context;
  const { id, startAt, endAt } = args;
  let offer = null;
  let views = null;

  // Require authorization.
  if (!shop) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    offer = await Offer.findById(id);

    if (!offer) {
      throw new ApolloError('Offer not found');
    }

    views = await offer.findViews(startAt, endAt);
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

  if (offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
    logger.warn(
      `Unauthorized access attempt for offer hits (${offer.toString()}) by shop (${shop.toString()})`
    );
    throw new ForbiddenError('Forbidden');
  }

  return views;
};

module.exports.offerAcceptances = async (root, args, context) => {
  const { shop, Offer } = context;
  const { id, startAt, endAt } = args;
  let offer = null;
  let acceptances = null;

  // Require authorization.
  if (!shop) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    offer = await Offer.findById(id);

    if (!offer) {
      throw new ApolloError('Offer not found');
    }

    acceptances = await offer.findAcceptances(startAt, endAt);
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

  if (offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
    logger.warn(
      `Unauthorized access attempt for offer hits (${offer.toString()}) by shop (${shop.toString()})`
    );
    throw new ForbiddenError('Forbidden');
  }

  return acceptances;
};

module.exports.offerConversions = async (root, args, context) => {
  const { shop, Offer } = context;
  const { id, startAt, endAt } = args;
  let offer = null;
  let conversions = null;

  // Require authorization.
  if (!shop) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    offer = await Offer.findById(id);

    if (!offer) {
      throw new ApolloError('Offer not found');
    }

    conversions = await offer.findConversions(startAt, endAt);
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

  if (offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
    logger.warn(
      `Unauthorized access attempt for offer hits (${offer.toString()}) by shop (${shop.toString()})`
    );
    throw new ForbiddenError('Forbidden');
  }

  return conversions;
};

module.exports.offerConversionRates = async (root, args, context) => {
  const { shop, Offer } = context;
  const { id, startAt, endAt } = args;
  let offer = null;
  let conversionRates = null;

  // Require authorization.
  if (!shop) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    offer = await Offer.findById(id);

    if (!offer) {
      throw new ApolloError('Offer not found');
    }

    conversionRates = await offer.findConversionRates(startAt, endAt);
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

  if (offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
    logger.warn(
      `Unauthorized access attempt for offer hits (${offer.toString()}) by shop (${shop.toString()})`
    );
    throw new ForbiddenError('Forbidden');
  }

  return conversionRates;
};

module.exports.offerRevenueIncreases = async (root, args, context) => {
  const { shop, Offer } = context;
  const { id, startAt, endAt } = args;
  let offer = null;
  let revenueIncreases = null;

  // Require authorization.
  if (!shop) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    offer = await Offer.findById(id);

    if (!offer) {
      throw new ApolloError('Offer not found');
    }

    revenueIncreases = await offer.findRevenueIncreases(startAt, endAt);
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

  if (offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
    logger.warn(
      `Unauthorized access attempt for offer hits (${offer.toString()}) by shop (${shop.toString()})`
    );
    throw new ForbiddenError('Forbidden');
  }

  return revenueIncreases;
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
