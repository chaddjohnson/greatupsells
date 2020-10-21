const {
  ApolloError,
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-lambda');
const logger = require('@neatowebsolutions/logger');

module.exports.products = async (root, args, context) => {
  const { shop, Product } = context;

  try {
    return await Product.findByShopId(shop._id);
  } catch (error) {
    throw new ApolloError('Error retrieving products');
  }
};

module.exports.product = async (root, args, context) => {
  const { shop, Product } = context;
  const { id } = args;
  let product = null;

  try {
    product = await Product.findById(id);
  } catch (error) {
    throw new ApolloError(`Error retrieving product`);
  }

  if (shop.shopifyShopId.notEquals(product.shopifyShopId)) {
    logger.warn(
      `Unauthorized request for product (${product.toString()}) by shop (${shop.toString()})`
    );
    throw new ForbiddenError('Forbidden');
  }

  return product;
};

module.exports.productShop = async (root, args, context) => {
  const { Shop } = context;
  const shopId = root.shop;

  try {
    return await Shop.findById(shopId);
  } catch (error) {
    throw new ApolloError('Error retrieving product shop');
  }
};

module.exports.shopProducts = async (root, args, context) => {
  const { shop, Product } = context;

  if (!shop) {
    throw new AuthenticationError('Unauthorized');
  }

  if (shop.id !== root.id) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    return await Product.findByShopId(root.id);
  } catch (error) {
    logger.error(`Error retrieving products for shop ${root.id}`, error);
    throw new ApolloError('Error retrieving shop products');
  }
};
