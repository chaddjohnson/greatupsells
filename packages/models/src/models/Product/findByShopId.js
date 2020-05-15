module.exports = async (shopId) => {
  const models = require('..');
  const Product = await models.get('Product');

  return Product.find({ shop: shopId });
};
