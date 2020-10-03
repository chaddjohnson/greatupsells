const getProductCount = async (shop) => {
  const models = require('..');
  const Product = await models.get('Product');
  const { shopifyShopId } = shop;

  return Product.countDocuments({ shopifyShopId });
};

module.exports = getProductCount;
