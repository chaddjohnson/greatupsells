const { ApolloError, AuthenticationError } = require('apollo-server-lambda');

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

module.exports.updateShop = async (root, args, context) => {
  // TODO
};
