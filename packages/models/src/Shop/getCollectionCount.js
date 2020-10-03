const getCollectionCount = async (shop) => {
  const models = require('..');
  const Collection = await models.get('Collection');
  const { shopifyShopId } = shop;

  return Collection.countDocuments({ shopifyShopId });
};

module.exports = getCollectionCount;
