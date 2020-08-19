const {
  ApolloError,
  AuthenticationError,
  UserInputError
} = require('apollo-server-lambda');
const logger = require('@neatowebsolutions/logger');

module.exports.offers = async (root, args, context) => {
  const { shop, user, Offer } = context;

  try {
    if (shop) {
      return await Offer.findByShopifyShopId(shop.shopifyShopId);
    }

    if (user) {
      return await Offer.find({});
    }
  } catch (error) {
    logger.error(
      `Error retrieving offers${shop ? ` for shop (${shop.toString()})` : ''}`,
      error
    );
    throw new ApolloError('Error retrieving offers');
  }

  throw new AuthenticationError('Unauthorized');
};

module.exports.offer = async (root, args, context) => {
  const { shop, user, Offer } = context;
  const { id } = args;
  let offer = null;

  if (!shop && !user) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    offer = await Offer.findById(id);
  } catch (error) {
    logger.error(`Error retrieving offer ${id}`, error);
    throw new ApolloError('Error retrieving offer');
  }

  if (!offer) {
    throw new ApolloError(`Offer not found`);
  }

  if (shop && offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
    logger.warn(
      `Unauthorized request for offer (${offer.toString()}) by shop (${shop.toString()})`
    );
    throw new AuthenticationError('Unauthorized');
  }

  return offer;
};

module.exports.offerShop = async (root, args, context) => {
  const { Shop } = context;

  try {
    return await Shop.findById(root.shop);
  } catch (error) {
    throw new ApolloError('Error retrieving offer shop');
  }
};

module.exports.createOffer = async (root, args, context) => {
  const { shop, user, Offer } = context;
  const offer = new Offer(...args.input);

  if (!user && !shop) {
    throw new AuthenticationError('Unauthorized');
  }

  if (user) {
    offer.shopifyShopId = shop.shopifyShopId;
    offer.shop = shop;
  }

  try {
    await offer.validate();
  } catch (error) {
    throw new UserInputError('Bad Request');
  }

  try {
    return await offer.save();
  } catch (error) {
    logger.error(`Error creating offer (${offer.toString()})`, error);
    throw new ApolloError('Error creating offer');
  }
};

module.exports.updateOffer = async (root, args, context) => {
  const { shop, user, Offer } = context;
  const { ...values } = args.input;
  const { id } = args;
  let offer = null;

  if (!shop && !user) {
    throw new AuthenticationError('Unauthorized');
  }

  // Disallow updating certain properties.
  delete values.shopifyShopId;
  delete values.shop;
  delete values.createdAt;
  delete values.updatedAt;
  delete values.viewCount;
  delete values.acceptanceCount;
  delete values.conversionCount;
  delete values.conversionRate;
  delete values.revenueIncrease;

  try {
    offer = await Offer.findById(id);
  } catch (error) {
    logger.error(`Error retrieving offer ${id}`, error);
    throw new ApolloError('Error retrieving offers');
  }

  if (!offer) {
    throw new ApolloError(`Offer not found`);
  }

  if (!shop && !user) {
    throw new AuthenticationError('Unauthorized');
  }

  if (shop && offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
    logger.warn(
      `Unauthorized update attempt for offer (${offer.toString()}) by shop (${shop.toString()})`
    );
    throw new AuthenticationError('Unauthorized');
  }

  try {
    offer.set(values);
    await offer.validate();
  } catch (error) {
    throw new UserInputError('Bad Request');
  }

  try {
    return await offer.save();
  } catch (error) {
    logger.error(`Error updating offer (${offer.toString()})`, error);
    throw new ApolloError(`Error updating offer (${offer.toString()})`);
  }
};

module.exports.deleteOffer = async (root, args, context) => {
  const { shop, user, Offer } = context;
  const { id } = args;
  let offer = null;

  if (!shop && !user) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    offer = await Offer.findById(id);
  } catch (error) {
    logger.error(`Error retrieving offer ${id}`, error);
    throw new ApolloError('Error retrieving offer');
  }

  if (!offer) {
    throw new ApolloError(`Offer not found`);
  }

  if (shop && offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
    logger.warn(
      `Unauthorized request for offer (${offer.toString()}) by shop (${shop.toString()})`
    );
    throw new AuthenticationError('Unauthorized');
  }

  try {
    await offer.remove();
  } catch (error) {
    logger.error(`Error removing offer (${offer.toString()})`, error);
    throw new ApolloError(`Error removing offer`);
  }
};
