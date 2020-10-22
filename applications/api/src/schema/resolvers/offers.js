const {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError
} = require('apollo-server-lambda');
const { omit } = require('lodash');
const logger = require('@neatowebsolutions/logger');

module.exports.offers = async (root, args, context) => {
  const { shop, Offer } = context;

  if (!shop) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    return await Offer.findByShopifyShopId(shop.shopifyShopId);
  } catch (error) {
    logger.error(
      `Error retrieving offers${shop ? ` for shop (${shop.toString()})` : ''}`,
      error
    );
    throw new ApolloError('Error retrieving offers');
  }
};

module.exports.offer = async (root, args, context) => {
  const { shop, Offer } = context;
  const { id } = args;
  let offer = null;

  if (!shop) {
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

  if (offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
    logger.warn(
      `Unauthorized request for offer (${offer.toString()}) by shop (${shop.toString()})`
    );
    throw new ForbiddenError('Forbidden');
  }

  return offer;
};

module.exports.randomOffer = async (root, args, context) => {
  const { ip, host, Shop } = context;
  const { event, shopifyProductIds } = args;
  let shop = null;
  let offerHit = null;

  if (!host) {
    logger.error(
      `Unable to retrieve offer as domain is unavailable`,
      context.event,
      args
    );
    throw new ApolloError(`Error retrieving offer`);
  }

  try {
    shop = await Shop.findByDomain(host);

    if (!shop) {
      logger.warn(
        `Shop ${host} not found when requesting offer for product(s) ${shopifyProductIds.join(
          ', '
        )}`
      );
      throw new ApolloError('Error retrieving offer');
    }

    offerHit = await shop.findRecentOfferHit(ip);

    // Abort if a recent offer hit for the requestor was found.
    // TODO: Allow if there is a timer (and any other cases?).
    if (offerHit) {
      return;
    }

    // Find a random offer for the shop.
    return await shop.findRandomOffer(event, shopifyProductIds);
  } catch (error) {
    logger.error(
      `Error retrieving offer for Shopify product(s) ${shopifyProductIds.join(
        ', '
      )} in shop ${shop.toString()}`,
      error,
      args
    );
    throw new ApolloError('Error retrieving offer');
  }
};

module.exports.offerShop = async (root, args, context) => {
  const { Shop } = context;
  const shopId = root.shop;

  try {
    return await Shop.findById(shopId);
  } catch (error) {
    throw new ApolloError('Error retrieving offer shop');
  }
};

module.exports.offerProduct = async (root, args, context) => {
  const { shop, Offer } = context;
  const offerId = root.id;
  let offer = null;
  let product = null;

  try {
    offer = await Offer.findById(offerId);

    if (!offer) {
      return;
    }

    product = await offer.findRandomProduct();
  } catch (error) {
    throw new ApolloError(`Error retrieving product for offer`);
  }

  // Verify the offer belongs to the shop.
  if (offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
    logger.warn(
      `Unauthorized update attempt for offer (${offer.toString()}) by shop (${shop.toString()})`
    );
    throw new ForbiddenError('Forbidden');
  }

  return product;
};

module.exports.createOffer = async (root, args, context) => {
  const { shop, Offer } = context;
  const offer = new Offer(...args.input);

  if (!shop) {
    throw new AuthenticationError('Unauthorized');
  }

  offer.shopifyShopId = shop.shopifyShopId;
  offer.shop = shop;

  try {
    await offer.validate();
  } catch (error) {
    throw new UserInputError('Bad Request');
  }

  try {
    return await offer.save();
  } catch (error) {
    logger.error(`Error creating offer (${offer.toString()})`, error, args);
    throw new ApolloError('Error creating offer');
  }
};

module.exports.updateOffer = async (root, args, context) => {
  const { shop, Offer } = context;
  const { id } = args;
  let { ...values } = args.input;
  let offer = null;

  if (!shop) {
    throw new AuthenticationError('Unauthorized');
  }

  // Disallow updating certain properties.
  values = omit(values, [
    'shopifyShopId',
    'shop',
    'offerViewCount',
    'offerAcceptanceCount',
    'offerConversionCount',
    'offerConversionRate',
    'revenueIncrease',
    'createdAt',
    'updatedAt'
  ]);

  try {
    offer = await Offer.findById(id);
  } catch (error) {
    logger.error(`Error retrieving offer ${id}`, error, args);
    throw new ApolloError('Error retrieving offers');
  }

  if (!offer) {
    throw new ApolloError(`Offer not found`);
  }

  // Verify the offer belongs to the shop.
  if (offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
    logger.warn(
      `Unauthorized update attempt for offer (${offer.toString()}) by shop (${shop.toString()})`
    );
    throw new ForbiddenError('Forbidden');
  }

  // Validate.
  try {
    offer.set(values);
    await offer.validate();
  } catch (error) {
    throw new UserInputError('Bad Request');
  }

  // Update.
  try {
    return await offer.save();
  } catch (error) {
    logger.error(`Error updating offer (${offer.toString()})`, error, args);
    throw new ApolloError(`Error updating offer (${offer.toString()})`);
  }
};

module.exports.deleteOffer = async (root, args, context) => {
  const { shop, Offer } = context;
  const { id } = args;
  let offer = null;

  if (!shop) {
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

  if (offer.shopifyShopId.notEquals(shop.shopifyShopId)) {
    logger.warn(
      `Unauthorized request for offer (${offer.toString()}) by shop (${shop.toString()})`
    );
    throw new ForbiddenError('Forbidden');
  }

  try {
    await offer.remove();
  } catch (error) {
    logger.error(`Error removing offer (${offer.toString()})`, error);
    throw new ApolloError(`Error removing offer`);
  }
};

module.exports.shopOffers = async (root, args, context) => {
  const { shop, Offer } = context;
  const shopId = root.id;

  if (!shop) {
    throw new AuthenticationError('Unauthorized');
  }

  if (shop.id !== shopId) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    return await Offer.findByShopId(shopId);
  } catch (error) {
    logger.error(`Error retrieving offers for shop ${root.id}`, error);
    throw new ApolloError('Error retrieving shop offers');
  }
};
