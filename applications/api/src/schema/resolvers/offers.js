const { ForbiddenError } = require('apollo-server-lambda');
const logger = require('@neatowebsolutions/logger');

module.exports.offers = async (root, args, context) => {
  const { shop, Offer } = context;

  // TODO: Allow admin users to retrieve all offers.

  const offer = await Offer.findByShopifyShopId(shop.shopifyShopId);

  return offer;
};

module.exports.offer = async (root, args, context) => {
  const { shop, Offer } = context;
  const { id } = args;
  let offer = null;

  // Retrieve existing offer if an ID is provided; otherwise, return an instantiated offer.
  if (id) {
    offer = await Offer.find(id);

    if (!offer) {
      throw new Error(`Offer ${id} not found`);
    }

    if (offer.shopifyShopId !== shop.shopifyShopId) {
      logger.warn(`Unauthorized request for offer ${offer.id}`, context);
      throw new ForbiddenError('Unauthorized');
    }
  } else {
    offer = new Offer();
  }

  return offer;
};

module.exports.offerShop = async (root, args, context) => {
  const { Shop } = context;
  const shop = await Shop.findById(root.shop);

  return shop;
};

module.exports.createOffer = async (root, args, context) => {
  const { shop, Offer } = context;
  const { shopifyShopId } = shop;

  return Offer.create({ ...args.input, shopifyShopId, shop });
};

module.exports.updateOffer = async (root, args, context) => {
  const { shop, Offer } = context;
  const { ...values } = args.input;
  const { id } = args;
  const offer = await Offer.findById(id);

  // Disallow updating certain properties.
  delete values.shopifyShopId;
  delete values.shop;

  if (!offer) {
    throw new Error(`Offer ${id} not found`);
  }

  if (offer.shopifyShopId !== shop.shopifyShopId) {
    logger.warn(`Unauthorized update attempt for offer ${offer.id}`, context);
    throw new ForbiddenError('Unauthorized');
  }

  offer.set(values);

  return offer.save();
};

module.exports.deleteOffer = async (root, args, context) => {
  const { shop, Offer } = context;
  const { id } = args;
  const offer = await Offer.findById(id);

  if (!offer) {
    throw new Error(`Offer ${id} not found`);
  }

  if (offer.shopifyShopId !== shop.shopifyShopId) {
    logger.warn(`Unauthorized deletion attempt for offer ${offer.id}`, context);
    throw new ForbiddenError('Unauthorized');
  }

  await offer.remove();
};
