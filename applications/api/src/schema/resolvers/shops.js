const { ApolloError, AuthenticationError } = require('apollo-server-lambda');
const logger = require('@neatowebsolutions/logger');

module.exports.shops = async (root, args, context) => {
  const { user, Shop } = context;

  if (!user) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    return await Shop.find({});
  } catch (error) {
    throw new ApolloError('Error retrieving shops');
  }
};

module.exports.shop = async (root, args, context) => {
  const { shop, user, Shop } = context;
  const { id } = args;

  if (shop) {
    return shop;
  }

  if (user) {
    try {
      return await Shop.findById(id);
    } catch (error) {
      throw new ApolloError('Error retrieving shop');
    }
  }

  throw new AuthenticationError('Unauthorized');
};

module.exports.shopOffers = async (root, args, context) => {
  const { shop, user, Offer } = context;

  if (!user && !shop) {
    throw new AuthenticationError('Unauthorized');
  }

  if (shop && shop.id !== root.id) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    return await Offer.findByShopId(root.id);
  } catch (error) {
    logger.error(`Error retrieving offers for shop ${root.id}`, error);
    throw new ApolloError('Error retrieving shop offers');
  }
};

module.exports.shopProducts = async (root, args, context) => {
  const { shop, user, Product } = context;

  if (!user && !shop) {
    throw new AuthenticationError('Unauthorized');
  }

  if (shop && shop.id !== root.id) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    return await Product.findByShopId(root.id);
  } catch (error) {
    logger.error(`Error retrieving products for shop ${root.id}`, error);
    throw new ApolloError('Error retrieving shop products');
  }
};
