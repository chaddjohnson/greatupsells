const { AuthenticationError, ApolloError } = require('apollo-server-lambda');
const logger = require('@neatowebsolutions/logger');

module.exports.products = async (root, args, context) => {
  const { user, Product } = context;

  if (!user) {
    throw new AuthenticationError('Unauthorized');
  }

  // TODO: Allow a shop to access its products.

  try {
    return await Product.find({});
  } catch (error) {
    throw new ApolloError('Error retrieving products');
  }
};

module.exports.product = async (root, args, context) => {
  const { user, Product } = context;
  const { id } = args;

  if (!user) {
    throw new AuthenticationError('Unauthorized');
  }

  // TODO: Allow a shop to access a product.

  try {
    return await Product.findById(id);
  } catch (error) {
    throw new ApolloError(`Error retrieving product`);
  }
};

module.exports.productShop = async (root, args, context) => {
  const { Shop } = context;

  try {
    return await Shop.findById(root.shop);
  } catch (error) {
    throw new ApolloError('Error retrieving product shop');
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
