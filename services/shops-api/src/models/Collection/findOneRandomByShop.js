const models = require('..');

const findOneRandomByShop = async (shop) => {
  const Collection = await models.get('Collection');
  const collections = await Collection.aggregate([{ $match: { shop: shop._id } }, { $sample: { size: 1 } }]);
  const collection = collections?.[0];

  return collection;
};

module.exports = findOneRandomByShop;
