const { ForbiddenError } = require('apollo-server-lambda');
const logger = require('@neatowebsolutions/logger');

module.exports.offers = async (root, args, context) => {
  const { shop, Offer } = context;

  // TODO: Allow admin users to retrieve all offers.

  const offer = await Offer.findByPlatformShopId(shop.platformShopId);

  return offer;
};

module.exports.offer = async (root, args, context) => {
  const { shop, Offer } = context;
  const offer = await Offer.find(args.id);

  if (!offer) {
    throw new Error(`Offer ${args.id} not found`);
  }

  if (offer.platformShopId !== shop.platformShopId) {
    logger.warn(`Unauthorized request for offer ${offer.id}`, context);
    throw new ForbiddenError('Unauthorized');
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
  const { platformShopId } = shop;

  return Offer.create({ ...args.input, platformShopId, shop });
};

module.exports.updateOffer = async (root, args, context) => {
  const { shop, Offer } = context;
  const { ...values } = args.input;
  const offer = await Offer.findById(args.id);

  // Disallow updating certain properties.
  delete values.platformShopId;
  delete values.shop;

  if (!offer) {
    throw new Error(`Offer ${args.id} not found`);
  }

  if (offer.platformShopId !== shop.platformShopId) {
    logger.warn(`Unauthorized update attempt for offer ${offer.id}`, context);
    throw new ForbiddenError('Unauthorized');
  }

  offer.set(values);

  return offer.save();
};

module.exports.deleteOffer = async (root, args, context) => {
  const { shop, Offer } = context;
  const offer = await Offer.findById(args.id);

  if (!offer) {
    throw new Error(`Offer ${args.id} not found`);
  }

  if (offer.platformShopId !== shop.platformShopId) {
    logger.warn(`Unauthorized deletion attempt for offer ${offer.id}`, context);
    throw new ForbiddenError('Unauthorized');
  }

  await offer.remove();
};
